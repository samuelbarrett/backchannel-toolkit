package dataproviders.network;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;

import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.ArrayBlockingQueue;

import dataproviders.DataProvider;
import datatypes.behaviors.BackchannelEvent;
import datatypes.behaviors.NodBackchannelEvent;
import datatypes.behaviors.UtteranceBackchannelEvent;

/**
 * Java 8 compatible HTTP client
 *
 * Polls (or long-polls) the Python server's `/robot/commands/next` endpoint
 * and converts the JSON into the existing `StateData` objects used by the
 * robot dialog controller.
 */
public class HttpCommandProvider extends DataProvider {

  private final String serverBaseUrl;
  private final int pollIntervalMs;
  private volatile boolean running = true;
  private final Object pollLock = new Object();
  private volatile boolean enabled = true;
  private final Gson gson = new Gson();
  private int robotId;
  private String localIp;
  private int micPort;
  private int audioPort;
  String getCommandUrl;

  /**
   * Handles threads spun up for each HTTP request (requestOnce calls)
   * Single-threaded executor with a small bounded queue to avoid thread churn
  */
  private final ThreadPoolExecutor requestExecutor = new ThreadPoolExecutor(
    1, 1, 0L, TimeUnit.MILLISECONDS,
    new ArrayBlockingQueue<Runnable>(4),
    new ThreadPoolExecutor.DiscardPolicy()
  );

  public HttpCommandProvider(String serverBaseUrl, int pollIntervalMs, int robotId, String localIp, int micPort, int audioPort) {
    this.serverBaseUrl = serverBaseUrl;
    this.pollIntervalMs = pollIntervalMs;
    this.robotId = robotId;
    this.localIp = localIp;
    this.micPort = micPort;
    this.audioPort = audioPort;
    // build URL containing robot ID parameter
    this.getCommandUrl = buildGetCommandUrl(this.robotId);
  }

  // build the GET command URL with robot ID parameter in the URL
  private String buildGetCommandUrl(int robotId) {
    String result= "";
    try {
      String robotIdParam = URLEncoder.encode(String.valueOf(robotId), "UTF-8");
      result = serverBaseUrl + "/command?robot_id=" + robotIdParam;
    } catch (Exception e) {
      e.printStackTrace();
    }
    return result;
  }

  // continuous polling loop
  @Override
  public void run() {
    while (running) {
      // wait while polling is disabled - thread gets parked by JVM and will not busy wait
      synchronized (pollLock) {
        while (!enabled && running) {
          try {
            pollLock.wait();
          } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            return;
          }
        }
      }

      // perform a single poll iteration
      singlePoll();

      try {
        Thread.sleep(pollIntervalMs);
      } catch (InterruptedException ie) {
        Thread.currentThread().interrupt();
        break;
      }
    }
  }

  /**
   * Initialize the robot to the server
   * @param robotId the robot's unique ID
   */
  public void initializeRobot(int robotId) {
    try {
      URL url = new URL(serverBaseUrl + "/robot/register");
      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("POST");
      conn.setDoOutput(true);
      conn.setRequestProperty("Content-Type", "application/json");
      conn.setRequestProperty("Accept", "application/json");

      // build JSON params for robot initialization
      JsonObject paramsJson = new JsonObject();
      paramsJson.addProperty("robot_id", String.valueOf(this.robotId));
      paramsJson.addProperty("ip", this.localIp);
      paramsJson.addProperty("voice_port", this.audioPort);
      paramsJson.addProperty("microphone_port", this.micPort);

      OutputStream os = conn.getOutputStream();
      os.write(paramsJson.toString().getBytes("UTF-8"));
      os.flush();
      os.close();
      
      int code = conn.getResponseCode();
      if (code == 200) {
        System.out.println("HttpCommandProvider: Robot initialized successfully.");
      } else {
        System.err.println("HttpCommandProvider: Robot initialization failed with code: " + code);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  /**
   * Perform a single HTTP GET to the server and notify listeners with the parsed StateData
   * This is used by both the main polling loop and external callers via requestOnce()
   */
  private void singlePoll() {
    HttpURLConnection conn = null;
    try {
      URL url = new URL(getCommandUrl);
      conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("GET");
      conn.setConnectTimeout(5000);
      // read timeout can be long for long-poll support
      conn.setReadTimeout(0);

      int code = conn.getResponseCode();
      if (code == 200) {
        String body = getResponseBody(conn);
        try {
          ServerCommand cmd = gson.fromJson(body, ServerCommand.class);
          BackchannelEvent behavior = buildBackchannel(cmd);
          this.notifyListeners(behavior);
        } catch (IllegalArgumentException e) {
          System.err.println("HttpCommandProvider: invalid command received: " + e.getMessage());
          return;
        } catch (JsonSyntaxException e) {
          System.err.println("HttpCommandProvider: failed to parse JSON response: " + e.getMessage());
          return;
        }
      } else {
        System.err.println("HttpCommandProvider: received non-200 response: " + code);
      }
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      if (conn != null) conn.disconnect();
    }
  }

  // Trigger a single non-blocking HTTP request and notify listeners with the result.
  public void requestOnce() {
    try {
      requestExecutor.submit(this::singlePoll);
    } catch (Exception e) {
      System.err.println("HttpCommandProvider: requestOnce rejected: " + e.getMessage());
    }
  }

  // Pause the background polling loop. Call {@link #resumePolling()} to wake.
  public void pausePolling() {
    this.enabled = false;
  }

  // Resume the background polling loop if paused.
  public void resumePolling() {
    synchronized (pollLock) {
      this.enabled = true;
      pollLock.notifyAll();
    }
  }

  public void shutdown() {
    this.running = false;
    synchronized (pollLock) {
      pollLock.notifyAll();
    }
    try {
      requestExecutor.shutdownNow();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  /**
   * Helper to read the full response body from the connection
   * @param conn the open HttpURLConnection
   * @return the response body as a string
   * @throws Exception
   */
  private static String getResponseBody(HttpURLConnection conn) throws Exception {
    BufferedReader requestBody = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
    StringBuilder sb = new StringBuilder();
    String line;
    while ((line = requestBody.readLine()) != null) sb.append(line);
    requestBody.close();

    return sb.toString();
  }

  /**
   * Internal class representing the expected JSON structure from the server
   * @param type The type of command. Permissible values: "nod", "utterance"
   */
  private static class ServerCommand {
    public String type;
    public int amplitude;
    public int speed;
    public String utterance;
  }

  /**
   * Builds a Behavior object from the ServerCommand
   * @param cmd the command received from the server
   */
  private static BackchannelEvent buildBackchannel(ServerCommand cmd) {
    if (cmd.type.equals("nod")) {
      return new NodBackchannelEvent(cmd.amplitude, cmd.speed);
    } else if (cmd.type.equals("utterance")) {
      return new UtteranceBackchannelEvent(cmd.utterance);
    } else {
      throw new IllegalArgumentException("Unknown command type: " + cmd.type);
    }
  }
}
