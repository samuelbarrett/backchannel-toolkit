import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { 
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Slider,
  Stack
} from '@mui/material';
import { useState } from 'react';
import { Style } from '../models/style.ts';

type Props = {
  robotStyle: Style;
  onChange?: (newStyle: Style) => void;
};

export default function StyleOptionsPane({robotStyle, onChange}: Props) {
  
  // construct and return an updated Style object, called on changes to any field
  const makeUpdatedStyle = (updates: Partial<Style>): Style => {
    return new Style(
      updates.nodding_behaviors ?? robotStyle.nodding_behaviors,
      updates.nodding_frequency ?? robotStyle.nodding_frequency,
      updates.nodding_intensity ?? robotStyle.nodding_intensity,
      updates.nodding_up_down ?? robotStyle.nodding_up_down,
      updates.nodding_left_right ?? robotStyle.nodding_left_right,
      updates.utterance_behaviors ?? robotStyle.utterance_behaviors,
      updates.utterance_frequency ?? robotStyle.utterance_frequency,
      updates.utterance_volume ?? robotStyle.utterance_volume,
      updates.utterances_list ?? robotStyle.utterances_list,
      updates.looking_behaviors ?? robotStyle.looking_behaviors,
      updates.looking_at_user_frequency ?? robotStyle.looking_at_user_frequency,
      updates.looking_shift_gaze_frequency ?? robotStyle.looking_shift_gaze_frequency
    );
  };

  return (
    <Box sx={{ padding: 2, width: 350 }}>
      <Stack spacing={1}>
        <Typography variant="h5">Style Options</Typography>
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={robotStyle.nodding_behaviors}
              onChange={(e) => onChange?.(makeUpdatedStyle({nodding_behaviors: e.target.checked}))}
            />
          }
          label="Nodding"/>
        <Divider />
        <CustomSlider
          title="Frequency"
          value={robotStyle.nodding_frequency}
          onChange={(v: number) => onChange?.(makeUpdatedStyle({nodding_frequency: v}))}
        />
      </Stack>
    </Box>
  );
}

function CustomSlider({
  title, 
  value,
  onChange
}: {
  title: string,
  value: number,
  onChange: (newValue: number) => void
}) {
  return (
    <Box sx={{ width: '85%', alignSelf: 'center' }}>
      <Typography gutterBottom>
        {title}
      </Typography>
      <Slider 
        aria-label={title}
        value={value}
        onChange={(e, newValue) => onChange(newValue as number)}
        valueLabelDisplay="auto"
        min={0}
        max={100}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ cursor: 'pointer' }}>less</Typography>
        <Typography variant="body2" sx={{ cursor: 'pointer' }}>more</Typography>
      </Box>
    </Box>
  )
}