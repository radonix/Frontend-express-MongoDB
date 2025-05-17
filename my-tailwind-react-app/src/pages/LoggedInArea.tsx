import React, { useState, useEffect } from "react";

// 1. Update types
export type Exercise = {
    name: string;
    sets: number;
    reps: number;
    weight: number;
};

export type Training = {
    _id?: string;
    name: string;
    description: string;
    date: string;
    exercises: Exercise[];
    createdAt?: string;
    updatedAt?: string;
};

// Define TrainingFormProps
type TrainingFormProps = {
    onSubmit: (data: Omit<Training, "_id" | "createdAt" | "updatedAt">) => Promise<void> | void;
    initialData?: Training | null;
    onCancel?: () => void;
};

// 2. Update TrainingForm
export const TrainingForm: React.FC<TrainingFormProps> = ({ onSubmit, initialData = null, onCancel }) => {
    const [name, setName] = useState<string>(initialData?.name || "");
    const [description, setDescription] = useState<string>(initialData?.description || "");
    const [date, setDate] = useState<string>(initialData?.date || "");
    const [exercises, setExercises] = useState<Exercise[]>(initialData?.exercises || [
        { name: "", sets: 1, reps: 1, weight: 0 }
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setName(initialData?.name || "");
        setDescription(initialData?.description || "");
        setDate(initialData?.date || "");
        setExercises(initialData?.exercises || [{ name: "", sets: 1, reps: 1, weight: 0 }]);
    }, [initialData]);

    const handleExerciseChange = (idx: number, field: keyof Exercise, value: string | number) => {
        setExercises((exs: Exercise[]) =>
            exs.map((ex: Exercise, i: number) =>
                i === idx ? { ...ex, [field]: field === "name" ? value : Number(value) } : ex
            )
        );
    };

    const addExercise = () => {
        setExercises((exs: Exercise[]) => [...exs, { name: "", sets: 1, reps: 1, weight: 0 }]);
    };

    const removeExercise = (idx: number) => {
        setExercises((exs: Exercise[]) => exs.length > 1 ? exs.filter((_: Exercise, i: number) => i !== idx) : exs);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSubmit({
                name: name.trim(),
                description: description.trim(),
                date: date.trim(),
                exercises: exercises.filter((ex: Exercise) => ex.name.trim()),
            });
            if (!initialData) {
                setName(""); setDescription(""); setDate(""); setExercises([{ name: "", sets: 1, reps: 1, weight: 0 }]);
            }
        } catch {}
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 16, borderRadius: 6, boxShadow: "0 2px 8px #0001", marginBottom: 16 }}>
            <h3 style={{ fontWeight: "bold", marginBottom: 8 }}>{initialData ? "Editar Treino" : "Adicionar Novo Treino"}</h3>
            <div style={{ marginBottom: 8 }}>
                <label style={{ display: "block", fontSize: 14 }}>Nome</label>
                <input style={{ border: "1px solid #ccc", padding: 8, width: "100%" }} value={name} onChange={e => setName(e.target.value)} required disabled={isLoading} />
            </div>
            <div style={{ marginBottom: 8 }}>
                <label style={{ display: "block", fontSize: 14 }}>Descrição</label>
                <input style={{ border: "1px solid #ccc", padding: 8, width: "100%" }} value={description} onChange={e => setDescription(e.target.value)} required disabled={isLoading} />
            </div>
            <div style={{ marginBottom: 8 }}>
                <label style={{ display: "block", fontSize: 14 }}>Data</label>
                <input style={{ border: "1px solid #ccc", padding: 8, width: "100%" }} value={date} onChange={e => setDate(e.target.value)} required disabled={isLoading} />
            </div>
            <div style={{ marginBottom: 8 }}>
                <label style={{ display: "block", fontSize: 14 }}>Exercícios</label>
                {exercises.map((ex: Exercise, idx: number) => (
                    <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center" }}>
                        <input
                            placeholder="Nome"
                            style={{ flex: 2, border: "1px solid #ccc", padding: 6 }}
                            value={ex.name}
                            onChange={e => handleExerciseChange(idx, "name", e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <input
                            type="number"
                            min={1}
                            placeholder="Séries"
                            style={{ width: 60, border: "1px solid #ccc", padding: 6 }}
                            value={ex.sets}
                            onChange={e => handleExerciseChange(idx, "sets", e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <input
                            type="number"
                            min={1}
                            placeholder="Reps"
                            style={{ width: 60, border: "1px solid #ccc", padding: 6 }}
                            value={ex.reps}
                            onChange={e => handleExerciseChange(idx, "reps", e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <input
                            type="number"
                            min={0}
                            placeholder="Peso"
                            style={{ width: 70, border: "1px solid #ccc", padding: 6 }}
                            value={ex.weight}
                            onChange={e => handleExerciseChange(idx, "weight", e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <button type="button" onClick={() => removeExercise(idx)} disabled={isLoading || exercises.length === 1} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, padding: "4px 8px" }}>-</button>
                    </div>
                ))}
                <button type="button" onClick={addExercise} disabled={isLoading} style={{ marginTop: 4, background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, padding: "4px 12px" }}>Adicionar Exercício</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" style={{ background: "#2563eb", color: "#fff", padding: "8px 16px", borderRadius: 4, border: "none" }} disabled={isLoading}>
                    {isLoading ? (initialData ? "Salvando..." : "Adicionando...") : (initialData ? "Salvar Alterações" : "Adicionar Treino")}
                </button>
                {onCancel && <button type="button" style={{ background: "#e5e7eb", padding: "8px 16px", borderRadius: 4, border: "none" }} onClick={onCancel} disabled={isLoading}>Cancelar</button>}
            </div>
        </form>
    );
};

// 3. Example display in the list (replace 't' with your Training object variable)
/*
<p>
    <strong>Exercícios:</strong>
    <ul style={{ margin: 0, paddingLeft: 16 }}>
        {training.exercises?.map((ex: Exercise, i: number) => (
            <li key={i}>
                {ex.name} - {ex.sets}x{ex.reps} ({ex.weight}kg)
            </li>
        ))}
    </ul>
</p>
*/
