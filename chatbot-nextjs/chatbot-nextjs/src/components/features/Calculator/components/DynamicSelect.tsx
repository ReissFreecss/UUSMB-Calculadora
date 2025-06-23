// components/DynamicSelect.tsx
import { FormControl, InputLabel, MenuItem, Select, CircularProgress } from "@mui/material";
import useDynamicSelect from "@/components/features/Calculator/hooks/useDynamicSelect";
import { SelectChangeEvent } from "@mui/material/Select";


interface Option {
    id: string | number;
    descripcion: string;
}

interface Props {
    label: string;
    name: string;
    endpoint: string;
    dependencyValue: string | number | null | undefined;
    value: string | number;
    onChange: (event: SelectChangeEvent) => void;
}

export default function DynamicSelect({
    label,
    name,
    endpoint,
    dependencyValue,
    value,
    onChange,
}: Props) {
    const { options, loading } = useDynamicSelect<Option>(endpoint, dependencyValue);

    return (
        <FormControl fullWidth margin="normal" disabled={!dependencyValue || loading}>
            <InputLabel>{label}</InputLabel>
            <Select name={name} value={value?.toString()} label={label} onChange={onChange}>
                <MenuItem value="">
                    <em>Selecciona...</em>
                </MenuItem>
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.descripcion}
                    </MenuItem>
                ))}
            </Select>
            {loading && <CircularProgress size={24} sx={{ position: "absolute", top: 12, right: 12 }} />}
        </FormControl>
    );
}
