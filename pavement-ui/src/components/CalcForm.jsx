// pavement-ui/src/components/CalcForm.jsx
import {
  Box,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";

const TYPES = ["flexible", "composite", "rigid"];
const FC2_OPTIONS = [
  "SUBBASE_ONLY_UNBOUND",
  "SUBBASE_ONLY_BOUND",
  "SUBBASE_ON_CAP_UNBOUND",
  "SUBBASE_ON_CAP_BOUND",
  "SUBBASE_ON_BOUND_CAP_UNBOUND",
  "SUBBASE_ON_BOUND_CAP_BOUND",
];

export default function CalcForm({
  form,
  fieldErrors,
  touched,
  hasErrors,
  onChange,
  onBlur,
  onSubmit,
}) {
  return (
    <Box component="form" noValidate onSubmit={onSubmit}>
      <Stack spacing={2}>
        {/* CBR */}
        <TextField
          id="cbr"
          name="cbr"
          label="Subgrade CBR (%)"
          type="number"
          inputProps={{ step: 0.1, min: 0.5, max: 30 }}
          required
          value={form.cbr}
          onChange={onChange}
          onBlur={onBlur}
          error={!!fieldErrors.cbr && (touched.cbr || form.cbr !== "")}
          helperText={(touched.cbr || form.cbr !== "") ? fieldErrors.cbr : ""}
          fullWidth
        />

        {/* MSA (required so the button doesn't feel dead if blank) */}
        <TextField
          id="msa"
          name="msa"
          label="Traffic (msa)"
          type="number"
          inputProps={{ min: 0, step: 0.1 }}
          required
          value={form.msa}
          onChange={onChange}
          onBlur={onBlur}
          error={!!fieldErrors.msa && (touched.msa || form.msa !== "")}
          helperText={
            (touched.msa || form.msa !== "")
              ? fieldErrors.msa
              : "Enter msa directly (e.g., 10, 30, 80)"
          }
          fullWidth
        />

        {/* Design life */}
        <TextField
          id="designLife"
          name="designLife"
          label="Design life (years)"
          type="number"
          inputProps={{ min: 10, max: 60 }}
          required
          value={form.designLife}
          onChange={onChange}
          onBlur={onBlur}
          error={!!fieldErrors.designLife && (touched.designLife || form.designLife !== "")}
          helperText={(touched.designLife || form.designLife !== "") ? fieldErrors.designLife : ""}
          fullWidth
        />

        {/* Pavement type */}
        <FormControl
          component="fieldset"
          error={!!fieldErrors.pavementType && (touched.pavementType || form.pavementType !== "")}
        >
          <FormLabel component="legend">Pavement type</FormLabel>
          <RadioGroup
            name="pavementType"
            value={form.pavementType}
            onChange={onChange}
            onBlur={onBlur}
          >
            {TYPES.map((t) => (
              <FormControlLabel
                key={t}
                value={t}
                control={<Radio />}
                label={t.charAt(0).toUpperCase() + t.slice(1)}
              />
            ))}
          </RadioGroup>
          {!!fieldErrors.pavementType &&
            (touched.pavementType || form.pavementType !== "") && (
              <FormHelperText>{fieldErrors.pavementType}</FormHelperText>
            )}
        </FormControl>

        {/* Foundation class */}
        <FormControl
          fullWidth
          error={
            !!fieldErrors.foundationClass &&
            (touched.foundationClass || form.foundationClass !== "")
          }
        >
          <InputLabel id="fc-label">Foundation class</InputLabel>
          <Select
            labelId="fc-label"
            id="foundationClass"
            name="foundationClass"
            label="Foundation class"
            value={form.foundationClass}
            onChange={onChange}
            onBlur={onBlur}
          >
            <MenuItem value="FC1">FC1</MenuItem>
            <MenuItem value="FC2">FC2</MenuItem>
            <MenuItem value="FC3">FC3</MenuItem>
            <MenuItem value="FC4">FC4</MenuItem>
          </Select>
          {(touched.foundationClass || form.foundationClass !== "") && (
            <FormHelperText>{fieldErrors.foundationClass}</FormHelperText>
          )}
        </FormControl>

        {/* Asphalt material — identical pattern to other selects; default set in DesignCalc */}
        <FormControl fullWidth>
          <InputLabel id="mat-label">Asphalt material</InputLabel>
          <Select
            labelId="mat-label"
            id="asphaltMaterial"
            name="asphaltMaterial"
            label="Asphalt material"
            value={form.asphaltMaterial}
            onChange={onChange}
            onBlur={onBlur}
          >
            <MenuItem value="HBGM">HBGM path (Eq 2.24)</MenuItem>
            <MenuItem value="AC_40_60">Asphalt base – AC 40/60</MenuItem>
            <MenuItem value="EME2">Asphalt base – EME2</MenuItem>
          </Select>
        </FormControl>

        {/* Foundation option (cd225) */}
        <FormControl
          fullWidth
          required
          error={!!fieldErrors.fc2Option && (touched.fc2Option || form.fc2Option !== "")}
        >
          <InputLabel id="fc2-label">Foundation option (fc2Option)</InputLabel>
          <Select
            labelId="fc2-label"
            id="fc2Option"
            name="fc2Option"
            label="Foundation option (fc2Option)"
            value={form.fc2Option}
            onChange={onChange}
            onBlur={onBlur}
          >
            {FC2_OPTIONS.map((o) => (
              <MenuItem key={o} value={o}>
                {o}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {(touched.fc2Option || form.fc2Option !== "")
              ? fieldErrors.fc2Option
              : "Choose foundation configuration."}
          </FormHelperText>
        </FormControl>

        <Button type="submit" variant="contained" disabled={hasErrors}>
          Calculate
        </Button>
      </Stack>
    </Box>
  );
}
