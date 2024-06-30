import React from 'react';
import Sheet from "@mui/joy/Sheet";

// Define the type of the props
interface SheetTestProps {
    children: React.ReactNode;
}

// Use the defined type in the component definition
export const BodySheet: React.FC<SheetTestProps> = ({ children }) => {
    return (
        <Sheet
            className={"mx-auto mt-6"}
            sx={{
                maxWidth: 800,
                borderRadius: "md",
                p: 3,
                boxShadow: "lg",
            }}
        >
            {children}
        </Sheet>
    );
};
