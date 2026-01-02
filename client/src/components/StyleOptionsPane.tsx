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
import { StyleSchema } from '../models/style.ts';
import { all_utterances } from '../models/style.ts';

type Props = {
  robotStyle: StyleSchema;
  onChange?: (newStyle: StyleSchema) => void;
};

/**
 * Main React component for the style options pane.
 * @param robotStyle the current style of the robot's behaviors, as a prop
 * @param onChange callback when any style option is changed, to update the style block's state
 * @returns a React JSX component
 */
export default function StyleOptionsPane({robotStyle, onChange}: Props) {
  
  // construct and return an updated Style object, called on changes to any field
  const makeUpdatedStyle = (updates: Partial<StyleSchema>): StyleSchema => {
    const newStyle: StyleSchema = {
      nodding: {
        enabled: updates.nodding?.enabled ?? robotStyle.nodding?.enabled,
        frequency: updates.nodding?.frequency ?? robotStyle.nodding?.frequency,
        intensity: updates.nodding?.intensity ?? robotStyle.nodding?.intensity,
        direction: updates.nodding?.direction ?? robotStyle.nodding?.direction,
      },
      utterances: {
        enabled: updates.utterances?.enabled ?? robotStyle.utterances?.enabled,
        utterance_frequency: updates.utterances?.utterance_frequency ?? robotStyle.utterances?.utterance_frequency,
        utterance_volume: updates.utterances?.utterance_volume ?? robotStyle.utterances?.utterance_volume,
        utterance_list: updates.utterances?.utterance_list ?? robotStyle.utterances?.utterance_list,
      },
      gaze: {
        enabled: updates.gaze?.enabled ?? robotStyle.gaze?.enabled,
        eye_contact: updates.gaze?.eye_contact ?? robotStyle.gaze?.eye_contact,
        shift_gaze: updates.gaze?.shift_gaze ?? robotStyle.gaze?.shift_gaze,
      }
    };
    return newStyle;
  };

  return (
    <Box sx={{ padding: 2, width: 350 }}>
      <Stack spacing={1}>
        <Typography variant="h5">Style Options</Typography>
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={robotStyle.nodding?.enabled}
              onChange={(e) => onChange?.(makeUpdatedStyle({nodding: { enabled: e.target.checked }}))}
            />
          }
          label="Nodding"/>
        <Divider />
        <CustomSlider
          title="Frequency"
          value={robotStyle.nodding?.frequency || 0}
          onChange={(v: number) => onChange?.(makeUpdatedStyle({nodding: { frequency: v }}))}
          isDisabled={!robotStyle.nodding?.enabled}
        />
        <CustomSlider
          title="Intensity"
          value={robotStyle.nodding?.intensity || 0}
          onChange={(v: number) => onChange?.(makeUpdatedStyle({nodding: { intensity: v }}))}
          isDisabled={!robotStyle.nodding?.enabled}
        />
        <FormControl>
          <FormLabel>Direction of nodding</FormLabel>
          <RadioGroup
            name="nodding-direction-group"
            value={robotStyle.nodding?.direction}
            onChange={(e) => onChange?.(makeUpdatedStyle({nodding: { direction: e.target.value as 'up_down' | 'left_right' }}))}
          >
            <FormControlLabel value="up_down" control={<Radio />} label="Up and Down" disabled={!robotStyle.nodding?.enabled} />
            <FormControlLabel value="left_right" control={<Radio />} label="Side to Side" disabled={!robotStyle.nodding?.enabled} />
          </RadioGroup>
        </FormControl>
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={robotStyle.utterances?.enabled}
              onChange={(e) => onChange?.(makeUpdatedStyle({utterances: { enabled: e.target.checked }}))}
            />
          }
          label="Verbal Utterances"/>
        <Divider />
        <CustomSlider
          title="Frequency"
          value={robotStyle.utterances?.utterance_frequency || 0}
          onChange={(v: number) => onChange?.(makeUpdatedStyle({utterances: { utterance_frequency: v }}))}
          isDisabled={!robotStyle.utterances?.enabled}
        />
        <CustomSlider
          title="Volume"
          value={robotStyle.utterances?.utterance_volume || 0}
          onChange={(v: number) => onChange?.(makeUpdatedStyle({utterances: { utterance_volume: v }}))}
          isDisabled={!robotStyle.utterances?.enabled}
        />
        <MultiSelect 
          value={robotStyle.utterances?.utterance_list || []}
          optionsList={all_utterances}
          onChange={(newList: string[]) => onChange?.(makeUpdatedStyle({utterances: { utterance_list: newList }}))}
          isDisabled={!robotStyle.utterances?.enabled}
        />
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={robotStyle.gaze?.enabled}
              onChange={(e) => onChange?.(makeUpdatedStyle({gaze: { enabled: e.target.checked }}))}
            />
          }
          label="Looking"/>
        <Divider />
        <CustomSlider
          title="Eye Contact"
          value={robotStyle.gaze?.eye_contact || 0}
          onChange={(v: number) => onChange?.(makeUpdatedStyle({gaze: { eye_contact: v }}))}
          isDisabled={!robotStyle.gaze?.enabled}
        />
        <CustomSlider
          title="Shift Gaze"
          value={robotStyle.gaze?.shift_gaze || 0}
          onChange={(v: number) => onChange?.(makeUpdatedStyle({gaze: { shift_gaze: v }}))}
          isDisabled={!robotStyle.gaze?.enabled}
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