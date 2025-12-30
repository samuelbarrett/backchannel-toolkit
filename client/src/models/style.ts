/**
 * Model representing style options for robot listening behaviors.
 */
export class Style {
  /**
   * Whether nodding is enabled
   */
  public nodding_behaviors: boolean;
  /**
   * Nodding frequency from 0 (never) to 100 (always)
   */
  public nodding_frequency: number;
  /**
   * Nodding intensity from 0 (subtle) to 100 (exaggerated)
   */
  public nodding_intensity: number;
  /**
   * Whether nodding up and down is enabled
   */
  public nodding_up_down: boolean;
  /**
   * Whether nodding side to side is enabled
   */
  public nodding_left_right: boolean;
  /**
   * Whether utterances are enabled
   */
  public utterance_behaviors: boolean;
  /**
   * Utterance frequency from 0 (never) to 100 (always)
   */
  public utterance_frequency: number;
  /**
   * Utterance volume from 0 (silent) to 100 (loud)
   */
  public utterance_volume: number;
  /**
   * List of utterances
   */
  public utterances_list: string[];
  /**
   * Whether looking behavior is enabled
   */
  public looking_behaviors: boolean;
  /**
   * Frequency of looking at the user from 0 (never) to 100 (always)
   */
  public looking_at_user_frequency: number;
  /**
   * Frequency of shifting gaze from 0 (never) to 100 (always)
   */
  public looking_shift_gaze_frequency: number;

  constructor(
      nodding_behaviors: boolean, 
      nodding_frequency: number,
      nodding_intensity: number,
      nodding_up_down: boolean,
      nodding_left_right: boolean,
      utterance_behaviors: boolean,
      utterance_frequency: number,
      utterance_volume: number,
      utterances_list: string[],
      looking_behaviors: boolean,
      looking_at_user_frequency: number,
      looking_shift_gaze_frequency: number
    ) {
    this.nodding_behaviors = nodding_behaviors;
    this.nodding_frequency = nodding_frequency;
    this.nodding_intensity = nodding_intensity;
    this.nodding_up_down = nodding_up_down;
    this.nodding_left_right = nodding_left_right;
    this.utterance_behaviors = utterance_behaviors;
    this.utterance_frequency = utterance_frequency;
    this.utterance_volume = utterance_volume;
    this.utterances_list = utterances_list;
    this.looking_behaviors = looking_behaviors;
    this.looking_at_user_frequency = looking_at_user_frequency;
    this.looking_shift_gaze_frequency = looking_shift_gaze_frequency;
  }
}

/**
 * Default parameters for styles
 */
export const happy_style = new Style(
  true,
  60,
  70,
  true,
  false,
  true,
  50,
  70,
  ["Uh-huh", "Yes!", "I see!"],
  true,
  80,
  20
);

export const sad_style = new Style(
  false,
  0,
  0,
  false,
  false,
  true,
  30,
  20,
  ["Hmm", "I understand", "Okay"],
  true,
  30,
  30
);

export const excited_style = new Style(
  true,
  80,
  90,
  true,
  false,
  true,
  80,
  70,
  ["Wow!", "That's amazing!", "Incredible!"],
  true,
  50,
  70
);

export const bored_style = new Style(
  true,
  20,
  20,
  false,
  true,
  false,
  0,
  0,
  [],
  true,
  10,
  10
);
