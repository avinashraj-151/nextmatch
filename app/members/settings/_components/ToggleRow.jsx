"use client"

import { useId } from "react"

import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import SettingsRow from "./SettingsRow"

function ToggleRow({
    icon,
    label,
    description,
    badge,
    checked,
    onCheckedChange,
    disabled = false,
}) {
    const id = useId()

    return (
        <SettingsRow
            icon={icon}
            label={label}
            description={description}
            badge={badge}
            htmlFor={id}
        >
            <Switch
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                className={cn(
                    "data-checked:bg-linear-to-r data-checked:from-rose-500 data-checked:via-fuchsia-600 data-checked:to-violet-600",
                    "data-checked:shadow-sm data-checked:shadow-fuchsia-900/20",
                )}
            />
        </SettingsRow>
    )
}

export default ToggleRow
