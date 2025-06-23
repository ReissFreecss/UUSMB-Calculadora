import { CheckboxField } from "./CheckBoxField";

interface ServiceSelectionProps {
    services: string[];
    onSelectService: (service: string) => void;
}

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({ services, onSelectService }) => (
    <div className="flex justify-between w-full">
        {services.map(service => (
            <CheckboxField
                key={service}
                label={service}
                checked={false} // Aquí puedes agregar el estado correspondiente
                onChange={(e) => onSelectService(service)}
            />
        ))}
    </div>
);
