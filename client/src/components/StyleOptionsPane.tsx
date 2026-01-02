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
  Stack,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  ListItemText,
  Checkbox,
  FormGroup,
  FormLabel,
  RadioGroup,
  Radio
} from '@mui/material';
import { useState } from 'react';
import { Style } from '../models/style.ts';
import { all_utterances } from '../models/style.ts';

type Props = {
  robotStyle: Style;
  onChange?: (newStyle: Style) => void;
};

/**
 * Main React component for the style options pane.
 * @param robotStyle the current style of the robot's behaviors, as a prop
 * @param onChange callback when any style option is changed, to update the style block's state
 * @returns a React JSX component
 */
export default function StyleOptionsPane({robotStyle, onChange}: Props) {
  
  // construct and return an updated Style object, called on changes to any field
  const makeUpdatedStyle = (updates: Partial<Style>): Style => {
    return new Style(
      updates.nodding_behaviors ?? robotStyle.nodding_behaviors,
      updates.nodding_frequency ?? robotStyle.nodding_frequency,
      updates.nodding_intensity ?? robotStyle.nodding_intensity,
      updates.nodding_direction ?? robotStyle.nodding_direction,
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
          isDisabled={!robotStyle.nodding_behaviors}
        />
        <CustomSlider
          title="Intensity"
          value={robotStyle.nodding_intensity}
          onChange={(v: number) => onChange?.(makeUpdatedStyle({nodding_intensity: v}))}
          isDisabled={!robotStyle.nodding_behaviors}
        />
        <FormControl>
          <FormLabel>Direction of nodding</FormLabel>
          <RadioGroup
            name="nodding-direction-group"
            value={robotStyle.nodding_direction}
            onChange={(e) => onChange?.(makeUpdatedStyle({nodding_direction: e.target.value}))}
          >
            <FormControlLabel value="up_down" control={<Radio />} label="Up and Down" disabled={!robotStyle.nodding_behaviors} />
            <FormControlLabel value="left_right" control={<Radio />} label="Side to Side" disabled={!robotStyle.nodding_behaviors} />
          </RadioGroup>
        </FormControl>
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={robotStyle.utterance_behaviors}
              onChange={(e) => onChange?.(makeUpdatedStyle({utterance_behaviors: e.target.checked}))}
            />
          }
          label="Verbal Utterances"/>
        <Divider />
        <CustomSlider
          title="Frequency"
          value={robotStyle.utterance_frequency}
          onChange={(v: number) => onChange?.(makeUpdatedStyle({utterance_frequency: v}))}
          isDisabled={!robotStyle.utterance_behaviors}
        />
        <CustomSlider
          title="Volume"
          value={robotStyle.utterance_volume}
          onChange={(v: number) => onChange?.(makeUpdatedStyle({utterance_volume: v}))}
          isDisabled={!robotStyle.utterance_behaviors}
        />
        <MultiSelect 
          value={robotStyle.utterances_list}
          optionsList={all_utterances}
          onChange={(newList: string[]) => onChange?.(makeUpdatedStyle({utterances_list: newList}))}
          isDisabled={!robotStyle.utterance_behaviors}
        />
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={robotStyle.looking_behaviors}
              onChange={(e) => onChange?.(makeUpdatedStyle({looking_behaviors: e.target.checked}))}
            />
          }
          label="Looking"/>
        <Divider />
        <CustomSlider
          title="Eye Contact"
          value={robotStyle.looking_at_user_frequency}
          onChange={(v: number) => onChange?.(makeUpdatedStyle({looking_at_user_frequency: v}))}
          isDisabled={!robotStyle.looking_behaviors}
        />
        <CustomSlider
          title="Shift Gaze"
          value={robotStyle.looking_shift_gaze_frequency}
          onChange={(v: number) => onChange?.(makeUpdatedStyle({looking_shift_gaze_frequency: v}))}
          isDisabled={!robotStyle.looking_behaviors}
        />
      </Stack>
    </Box>
  );
}

/**
 * A custom slider component for style options.
 * @param title the name of the option
 * @param value the current value
 * @param onChange callback when the value changes
 * @param isDisabled whether the slider is disabled
 * @returns 
 */
function CustomSlider({
  title, 
  value,
  onChange,
  isDisabled
}: {
  title: string,
  value: number,
  onChange: (newValue: number) => void,
  isDisabled?: boolean
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
        disabled={isDisabled}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ cursor: 'pointer' }}>less</Typography>
        <Typography variant="body2" sx={{ cursor: 'pointer' }}>more</Typography>
      </Box>
    </Box>
  )
}

/**
 * A multiselect checkbox list for selecting any subset of the provided options.
 * @param value the currently selected options
 * @param optionsList the list of all available options
 * @param onChange callback when the selected options change
 * @param isDisabled whether the multiselect is disabled
 * @returns
 */
function MultiSelect({
  value,
  optionsList,
  onChange,
  isDisabled,
}: {
  value: string[],
  optionsList: string[],
  onChange: (selectedOptions: string[]) => void
  isDisabled?: boolean,
}) {

  // define menu style properties
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 175,
      },
    },
  }

  return (
    <FormControl sx={{ m: 1, width: 200 }}>
      <InputLabel id="mutiple-checkbox-label">What the Robot Says</InputLabel>
      <Select
        labelId="mutiple-checkbox-label"
        id="mutiple-checkbox"
        multiple
        value={value}
        onChange={(e, newValue) => onChange(e.target.value as string[])}
        disabled={isDisabled}
        input={<OutlinedInput label="What the Robot Says" />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
      >
        {optionsList.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={value.indexOf(option) > -1} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}