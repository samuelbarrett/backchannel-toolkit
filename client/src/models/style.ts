/**
 * Model representing style options for robot listening behaviors.
 */
export class Style {
  /**
   * Whether nodding is enabled
   */
  public nodding_enabled: boolean;
  /**
   * Nodding frequency from 0 (never) to 1 (always)
   */
  public nodding_frequency: number;
  /**
   * Nodding intensity from 0 (subtle) to 1 (exaggerated)
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
  public utterances_enabled: boolean;
  /**
   * Utterance frequency from 0 (never) to 1 (always)
   */
  public utterance_frequency: number;
  /**
   * Utterance volume from 0 (silent) to 1 (loud)
   */
  public utterance_volume: number;
  /**
   * List of utterances
   */
  public utterances_list: string[];
  /**
   * Whether looking behavior is enabled
   */
  public looking_enabled: boolean;
  /**
   * Frequency of looking at the user from 0 (never) to 1 (always)
   */
  public looking_at_user_frequency: number;
  /**
   * Frequency of shifting gaze from 0 (never) to 1 (always)
   */
  public looking_shift_gaze_frequency: number;

  constructor(
      nodding_enabled: boolean, 
      nodding_frequency: number,
      nodding_intensity: number,
      nodding_up_down: boolean,
      nodding_left_right: boolean,
      utterances_enabled: boolean,
      utterance_frequency: number,
      utterance_volume: number,
      utterances_list: string[],
      looking_enabled: boolean,
      looking_at_user_frequency: number,
      looking_shift_gaze_frequency: number
    ) {
    this.nodding_enabled = nodding_enabled;
    this.nodding_frequency = nodding_frequency;
    this.nodding_intensity = nodding_intensity;
    this.nodding_up_down = nodding_up_down;
    this.nodding_left_right = nodding_left_right;
    this.utterances_enabled = utterances_enabled;
    this.utterance_frequency = utterance_frequency;
    this.utterance_volume = utterance_volume;
    this.utterances_list = utterances_list;
    this.looking_enabled = looking_enabled;
    this.looking_at_user_frequency = looking_at_user_frequency;
    this.looking_shift_gaze_frequency = looking_shift_gaze_frequency;
  }
}

/**
 * Default parameters for styles
 */
export const happy_style = new Style(
  true,
  0.6,
  0.7,
  true,
  false,
  true,
  0.5,
  0.7,
  ["Uh-huh", "Yes!", "I see!"],
  true,
  0.8,
  0.2
);

export const sad_style = new Style(
  false,
  0.0,
  0.0,
  false,
  false,
  true,
  0.3,
  0.2,
  ["Hmm", "I understand", "Okay"],
  true,
  0.3,
  0.3
);

export const excited_style = new Style(
  true,
  0.8,
  0.9,
  true,
  false,
  true,
  0.8,
  1.0,
  ["Wow!", "That's amazing!", "Incredible!"],
  true,
  0.5,
  0.7
);

export const bored_style = new Style(
  true,
  0.2,
  0.2,
  false,
  true,
  false,
  0.0,
  0.0,
  [],
  true,
  0.1,
  0.1
);
