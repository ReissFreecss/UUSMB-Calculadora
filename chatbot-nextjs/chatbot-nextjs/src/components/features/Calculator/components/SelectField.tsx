interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string, label: string }[];
    disabled?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options, disabled = false }) => (
    <div className="w-full">
        <label htmlFor={label} className="label">{label}</label>
        <select
            id={label}
            name={label}
            autoComplete={label}
            className="select"
            value={value}
            onChange={onChange}
            disabled={disabled}
        >
            <option disabled>Selecciona una opción</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);
