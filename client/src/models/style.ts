import type { components } from '../services/api/openapi-types.ts';

export type StyleSchema = components['schemas']['Style'];

/**
 * All available utterance options
 */
export const all_utterances: string[] = [
  "Uh-huh", "Yes", "I see", "Hmm", "Okay", "Uhh", "Sigh", "Wow", "No", "Mhm", "Right"
]

/**
 * Default parameters for provided styles
 */
export const happy_style: StyleSchema = {
  nodding: {
    enabled: true,
    frequency: 60,
    intensity: 70,
    direction: "up_down"
  },
  utterances: {
    enabled: true,
    utterance_frequency: 50,
    utterance_volume: 70,
    utterance_list: ["Uh-huh", "Yes", "I see"]
  },
  gaze: {
    enabled: true,
    eye_contact: 80,
    shift_gaze: 20
  }
};

export const sad_style: StyleSchema = {
  nodding: {
    enabled: false,
    frequency: 20,
    intensity: 10,
    direction: "left_right"
  },
  utterances: {
    enabled: true,
    utterance_frequency: 30,
    utterance_volume: 30,
    utterance_list: ["Sigh", "Hmm", "Okay", "Uhh"]
  },
  gaze: {
    enabled: true,
    eye_contact: 30,
    shift_gaze: 30
  }
};

export const excited_style: StyleSchema = {
  nodding: {
    enabled: true,
    frequency: 80,
    intensity: 90,
    direction: "up_down"
  },
  utterances: {
    enabled: true,
    utterance_frequency: 80,
    utterance_volume: 70,
    utterance_list: ["Wow", "Yes"]
  },
  gaze: {
    enabled: true,
    eye_contact: 50,
    shift_gaze: 70
  }
};

export const bored_style: StyleSchema = {
  nodding: {
    enabled: true,
    frequency: 20,
    intensity: 20,
    direction: "left_right"
  },
  utterances: {
    enabled: false,
    utterance_frequency: 0,
    utterance_volume: 0,
    utterance_list: []
  },
  gaze: {
    enabled: true,
    eye_contact: 10,
    shift_gaze: 10
  }
};
