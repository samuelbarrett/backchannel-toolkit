package dataprocessors.sota;

import dataprocessors.DataProcessor;
import datatypes.Data;
import datatypes.behaviors.BackchannelEvent;
import eventsystem.EventGenerator;
import tools.ServoRangeTool;

import jp.vstone.RobotLib.*;

/**
 * A controller for the Sota robot that manages its output for dialog.
 * Interacts with the Sota through the vstone API directly.
 */
public class SotaDialogController extends DataProcessor {
    /**
     * SotaStateData defines the robot's states.
     * BUSY - the robot is processing input or performing an action
     * READY - the robot is ready to receive input
     */
    public enum SotaState { BUSY, READY }
    public static class SotaStateData extends Data {
        private static final long serialVersionUID = 1L;
        public final SotaState data;
        
        public SotaStateData(SotaState s) {
            this.data = s;
        }

        public String toString() {
            return data.name();
        }
    }
    
    // ------------- SotaDialogController -------------
    static final String TAG = "SotaDialogController";
    private CSotaMotion motion;
    private CRobotMem mem;

    // robot motor poses
    private CRobotPose nodNeutral = null;
    private CRobotPose nodDown = null;
    private CRobotPose nodUp = null;

    private SotaState state;
    private long backchannelFinishTimeMs;    // when the robot will finish speaking
    private static final long MIN_BACKCHANNEL_INTERVAL_MS = 1000; // minimum time between backchannels

    public SotaDialogController() {
        this.mem = new CRobotMem();
		this.motion = new CSotaMotion(mem);
        this.backchannelFinishTimeMs = 0;
        this.state = SotaState.READY;

        mem.Connect();
        this.motion.InitRobot_Sota();
        this.motion.ServoOn();
        this.initNodPoses();
    }
    
    @Override
    protected Data process(Data input, EventGenerator sender) {
        BackchannelEvent backchannel = (BackchannelEvent) input;
        return update(backchannel);
    }

    public SotaStateData update(BackchannelEvent backchannel) {
        // manage internal Sota state
        if (this.state == SotaState.BUSY) {
            long currentTimeMs = System.currentTimeMillis();
            if (currentTimeMs > this.backchannelFinishTimeMs) {
                this.state = SotaState.READY;
            }
        }
        if (this.state == SotaState.READY) {
            executeBackchannel(backchannel);
            this.state = SotaState.BUSY;
        }
        return new SotaStateData(this.state);
    }

    /**
     * Executes the given backchannel behavior on the robot.
     * @param backchannel the backchannel event to execute
     */
    private void executeBackchannel(BackchannelEvent backchannel) {
        if (backchannel.getType() == BackchannelEvent.BEHAVIOR_TYPE.NOD) {
            playNod();
        } else if (backchannel.getType() == BackchannelEvent.BEHAVIOR_TYPE.UTTERANCE) {
            playVerbalBackchannel();
        }
    }
    
    // plays a backchannel
    private void playVerbalBackchannel() {
        long playTime = CPlayWave.getPlayTime("../resources/minecraft-villager-complete-trade.wav");
        long currentTimeMs = System.currentTimeMillis();
        this.backchannelFinishTimeMs = currentTimeMs + playTime + MIN_BACKCHANNEL_INTERVAL_MS;
        CPlayWave.PlayWave("../resources/minecraft-villager-complete-trade.wav");
    }
    
    // Adjust head pitch to make Sota nod using the nod poses
    private void playNod() {
        long playTime = 1000;
        long currentTimeMs = System.currentTimeMillis();
        this.backchannelFinishTimeMs = currentTimeMs + playTime + MIN_BACKCHANNEL_INTERVAL_MS;
        
        this.motion.play(nodDown, 275);
        this.motion.waitEndinterpAll();
        
        // this.motion.play(nodUp, 400);
        // this.motion.waitEndinterpAll();
        
        this.motion.play(nodNeutral, 400);
        this.motion.waitEndinterpAll();
    }
    
    /**
     * Initializes the motor poses for head nodding (head pitch motor positions).
     * Ensure the robot starts in a neutral position with its head facing forward.
     */
    private void initNodPoses() {
        ServoRangeTool ranges = ServoRangeTool.Load("../resources/servo/head_nod_motor_positions");
        CRobotPose minPose = ranges.getMinPose();
        CRobotPose maxPose = ranges.getMaxPose();
        CRobotPose midPose = ranges.getMidPose();
        
        this.nodNeutral = this.motion.getReadPose();
        this.nodDown = this.motion.getReadPose();
        this.nodUp = this.motion.getReadPose();
        
        // extract just the head pitch motor position from saved ServoRangeTool obj
        // and don't change the rest of the pose
        Short minHeadPitch = minPose.getServoAngle(Byte.valueOf(CSotaMotion.SV_HEAD_P));
        Short maxHeadPitch = maxPose.getServoAngle(Byte.valueOf(CSotaMotion.SV_HEAD_P));
        Short midHeadPitch = midPose.getServoAngle(Byte.valueOf(CSotaMotion.SV_HEAD_P));
        
        this.nodUp.addServoAngle(Byte.valueOf(CSotaMotion.SV_HEAD_P), minHeadPitch);
        this.nodNeutral.addServoAngle(Byte.valueOf(CSotaMotion.SV_HEAD_P), midHeadPitch);
        this.nodDown.addServoAngle(Byte.valueOf(CSotaMotion.SV_HEAD_P), maxHeadPitch);
    }
}