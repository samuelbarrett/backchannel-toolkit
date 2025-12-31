import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StyleOptionsPane from '../StyleOptionsPane.tsx';
import { Style } from '../../models/style.ts';

describe('StyleOptionsPane', () => {
  const baseStyle = new Style(
    false, // nodding_behaviors
    20, // nodding_frequency
    10, // nodding_intensity
    true, // nodding_up_down
    false, // nodding_left_right
    false, // utterance_behaviors
    10, // utterance_frequency
    50, // utterance_volume
    [], // utterances_list
    false, // looking_behaviors
    5, // looking_at_user_frequency
    5 // looking_shift_gaze_frequency
  );

  test('calls onChange when the nodding switch is toggled', () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <StyleOptionsPane robotStyle={baseStyle} onChange={onChange} />
    );

    const switchEl = getByLabelText(/Nodding/i) as HTMLInputElement;
    expect(switchEl).toBeInTheDocument();

    // toggle switch
    fireEvent.click(switchEl);

    expect(onChange).toHaveBeenCalled();
    const newStyle = onChange.mock.calls[0][0];
    expect(newStyle).toBeInstanceOf(Style);
    expect(newStyle.nodding_behaviors).toBe(true);
  });

  test('calls onChange when the frequency slider changes', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <StyleOptionsPane robotStyle={baseStyle} onChange={onChange} />
    );

    // MUI Slider exposes role="slider" with aria-label equal to the title
    const slider = getByRole('slider', { name: /Frequency/i }) as HTMLElement;
    expect(slider).toBeInTheDocument();

    // Simulate change to 60
    fireEvent.change(slider, { target: { value: '60' } });

    // onChange should have been called at least once
    expect(onChange).toHaveBeenCalled();
    const newStyle = onChange.mock.calls[0][0];
    expect(newStyle).toBeInstanceOf(Style);
    expect(newStyle.nodding_frequency).toBe(60);
  });
});
