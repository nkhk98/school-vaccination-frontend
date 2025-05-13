import React, { useState, type ReactNode } from 'react';
// Utility function for class name merging
const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

interface TabsProps {
    defaultValue?: string;
    className?: string;
    onValueChange?: (value: string) => void; // Add this for consistency
    children: React.ReactNode;
}

interface TabsListProps {
    className?: string;
    children: ReactNode;
}

interface TabsTriggerProps {
    value: string;
    className?: string;
    children: ReactNode;
}

interface TabsContentProps {
    value: string;
    className?: string;
    children: ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, className, onValueChange, children }) => {
    const [value, setValue] = useState(defaultValue || getFirstValue(children) || '');

    const handleChange = (newValue: string) => {
        setValue(newValue);
        onValueChange?.(newValue); // Use optional chaining
    };

    // Helper function to get the first value
    function getFirstValue(nodes: React.ReactNode): string | undefined {
        if (!nodes) return undefined;

        if (Array.isArray(nodes)) {
            for (const child of nodes) {
                if (React.isValidElement(child) && child.type === TabsTrigger) {
                    return (child as React.ReactElement<TabsTriggerProps>).props.value;
                }
            }
        } else if (React.isValidElement(nodes) && nodes.type === TabsTrigger) {
            return (nodes as React.ReactElement<TabsTriggerProps>).props.value;
        }
        return undefined;
    }

    // Enhanced Context
    const tabsContext = React.useMemo(() => ({
        value,
        onValueChange: handleChange,
    }), [value, handleChange]);

    return (
        <TabsContext.Provider value={tabsContext}>
            <div className={cn("w-full", className || "")}>{children}</div>
        </TabsContext.Provider>
    );
};

const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
    return (
        <div className={cn("flex space-x-2", className || "")}>{children}
        </div>
    );
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children }) => {
    const { value: contextValue, onValueChange } = React.useContext(TabsContext);
    const isActive = contextValue === value;

    return (
        <button
            className={cn(
                "px-4 py-2 rounded-md transition-colors duration-200",
                isActive
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200 text-gray-700",
                className || ""
            )}
            onClick={() => onValueChange(value)}
        >
            {children}
        </button>
    );
};

const TabsContent: React.FC<TabsContentProps> = ({ value, className, children }) => {
    const { value: contextValue } = React.useContext(TabsContext);
    const isActive = contextValue === value;

    return isActive ? <div className={className}>{children}</div> : null;
};

// Create a context
const TabsContext = React.createContext<{ value: string; onValueChange: (value: string) => void; }>({
    value: '',
    onValueChange: () => { },
});
TabsContext.displayName = 'TabsContext';


export { Tabs, TabsList, TabsTrigger, TabsContent };
