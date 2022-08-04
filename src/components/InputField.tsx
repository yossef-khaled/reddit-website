//Import react
import React, { FC, InputHTMLAttributes } from 'react'; 

//import from @chakra-ui
import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';

//Import from formik
import { useField } from 'formik';

// Here, I defined this component props as a InputHTMLAttributes<HTMLInputElement>,
// which is what any inputfield accepts
// Also, I have added name as a prop 
type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string; // required, for useField hook
    label: string;
    placeholder: string;
}

const InputField: FC<InputFieldProps> = ({label, placeholder, size: _, ...props}) => { // Rename unused prop 'size' to '_'
    
    const [field, {error}] = useField(props);

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel 
                htmlFor={field.name}
            >
                {label}
            </FormLabel>
            <Input 
                {...field} 
                {...props}
                type={props.type}
                id={field.name} 
                placeholder={placeholder}
            />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
}

export default InputField;