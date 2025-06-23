interface CheckboxFieldProps {
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, checked, onChange }) => (
    <label htmlFor={label} className="checkbox-label">
        <input type="checkbox" id={label} checked={checked} onChange={onChange} className="cb" />
        {label}
    </label>
);
