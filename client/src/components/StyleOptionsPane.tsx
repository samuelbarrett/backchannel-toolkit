import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Slider } from '@mui/material';
import Divider from '@mui/material/Divider/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch/Switch';
import Typography from '@mui/material/Typography/Typography';
import { useState } from 'react';
import { Style } from 'src/models/style';

export default function StyleOptionsPane({robotStyle}: {robotStyle: Style}) {
  const [nodding, setNodding] = useState(robotStyle.nodding_enabled);
  console.log("Rendering StyleOptionsPane with style:", robotStyle);

  return (
    <div>
      <Typography variant="h6">Style Options</Typography>
      <Divider />
      <FormControlLabel control={<Switch checked={nodding} onChange={(e) => setNodding(e.target.checked)} />} label="Nodding"/>
      <Divider variant="middle" />
      {CustomSlider("Frequency")}
    </div>
  );
}

function CustomSlider(title: string) {
  return (
    <div>
      <Typography gutterBottom>
        {title}
      </Typography>
      <Slider 
        aria-label={title}
        defaultValue={50}
        valueLabelDisplay="auto"
        marks={[{value: 0, label: 'less'}, {value: 100, label: 'more'}]}
      />
    </div>
  )
}