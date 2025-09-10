import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className,
  ...inputProps
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
      )}
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={!!error}
        {...inputProps}
      />
      {error && (
        <p className="text-sm text-error-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;