import { ChangeEvent } from 'react'
import styles from './input.module.css'

interface Props {
    label: string
    error?: string
    type?: string
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function Input({ label, error, type, value, onChange }: Props) {
    return (
        <div>
            <div className={styles.formProperty}>
                <label>{label}</label>
                <input
                    type={type}
                    value={value}
                    className={styles.input}
                    onChange={(e) => onChange(e)}
                />
            </div>
            {error && <div className={styles.error}>{error}</div>}
        </div>
    )
}
