//Import react
import React, { FC, InputHTMLAttributes } from 'react'; 

//import from @chakra-ui
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react';

//Import from formik
import { useField } from 'formik';

// Here, I defined this component props as a InputHTMLAttributes<HTMLInputElement>,
// which is what any inputfield accepts
// Also, I have added name as a prop 
type InputFieldProps = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
    name: string; // required, for useField hook
    label: string;
    textarea?: boolean;
    placeholder: string;
}

const InputField: FC<InputFieldProps> = ({label, textarea, placeholder, size: _, ...props}) => { // Rename unused prop 'size' to '_'
    
    const [field, {error}] = useField(props);

    const InputOrTextarea = textarea ? Textarea : Input;
    
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel 
                htmlFor={field.name}
            >
                {label}
            </FormLabel>
            <InputOrTextarea 
                {...field} 
                {...props}
                type={props.type}
                height={textarea ? 250 : 50}
                id={field.name} 
                placeholder={placeholder}
            />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
}

export default InputField;