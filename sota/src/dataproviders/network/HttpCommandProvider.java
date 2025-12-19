package dataproviders.network;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import com.google.gson.Gson;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.ArrayBlockingQueue;

import datatypes.StateData;
import dataprocessors.SilenceDetector.SilenceStatusData;
import dataprocessors.SilenceDetector.Status;
import dialog.ToolkitState;
import dataproviders.DataProvider;

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

  /**
   * Handles threads spun up for each HTTP request (requestOnce calls)
   * Single-threaded executor with a small bounded queue to avoid thread churn
  */
  private final ThreadPoolExecutor requestExecutor = new ThreadPoolExecutor(
    1, 1, 0L, TimeUnit.MILLISECONDS,
    new ArrayBlockingQueue<Runnable>(4),
    new ThreadPoolExecutor.DiscardPolicy()
  );

  public HttpCommandProvider(String serverBaseUrl, int pollIntervalMs) {
    this.serverBaseUrl = serverBaseUrl;
    this.pollIntervalMs = pollIntervalMs;
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
   * Perform a single HTTP GET to the server and notify listeners with the parsed StateData
   * This is used by both the main polling loop and external callers via requestOnce()
   */
  private void singlePoll() {
    HttpURLConnection conn = null;
    try {
      URL url = new URL(serverBaseUrl + "/robot/commands/next");
      conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("GET");
      conn.setConnectTimeout(5000);
      // read timeout can be long for long-poll support
      conn.setReadTimeout(30000);

      int code = conn.getResponseCode();
      if (code == 200) {
        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = in.readLine()) != null) sb.append(line);
        in.close();

        String body = sb.toString();
        // Expecting JSON that contains ToolkitState fields and optional silenceStatus
        ServerCommand cmd = gson.fromJson(body, ServerCommand.class);

        ToolkitState toolkitState = cmd.toolkitState != null ? cmd.toolkitState : new ToolkitState();
        SilenceStatusData silence = null;
        if (cmd.silenceStatus != null) {
          try {
            Status s = Status.valueOf(cmd.silenceStatus);
            silence = new SilenceStatusData(s);
          } catch (Exception e) {
            silence = new SilenceStatusData(Status.STARTUP);
          }
        } else {
          silence = new SilenceStatusData(Status.STARTUP);
        }

        StateData stateData = new StateData(toolkitState, silence);
        this.notifyListeners(stateData);
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

  private static class ServerCommand {
    // will map directly into dialog.ToolkitState fields via Gson
    public ToolkitState toolkitState;
    // optional string name of SilenceDetector.Status e.g. "TALKING"
    public String silenceStatus;
  }
}
