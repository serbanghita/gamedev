type PropertiesOptions = {
    [key: string]: string | number | unknown;
}

export function extend<T extends PropertiesOptions , U extends Partial<PropertiesOptions>>(props: T, newProps: U) {
    if (!newProps) {
        return props;
    }

    return { ...props, ...newProps};
}