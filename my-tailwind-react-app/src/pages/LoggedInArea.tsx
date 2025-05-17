import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Make sure to install react-toastify
import "./LoggedInArea.css"; // Optional: for custom styles

const API_BASE_URL = "https://zany-winner-x496vg95wgfv659-3000.app.github.dev";

type Training = {
    _id?: string;
    name: string;
    description: string;
    date: string;
    exercises: string[];
    createdAt?: string;
    updatedAt?: string;
};

function getToken() {
    return localStorage.getItem("token") || "";
}

type TrainingFormProps = {
    onSubmit: (data: Omit<Training, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
    initialData?: Training | null;
    onCancel?: () => void;
};

function TrainingForm({ onSubmit, initialData = null, onCancel }: TrainingFormProps) {
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [date, setDate] = useState(initialData?.date || "");
    const [exercisesInput, setExercisesInput] = useState(initialData?.exercises?.join(", ") || "");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSubmit({
                name: name.trim(),
                description: description.trim(),
                date: date.trim(),
                exercises: exercisesInput.split(",").map(e => e.trim()).filter(Boolean),
            });
            if (!initialData) {
                setName(""); setDescription(""); setDate(""); setExercisesInput("");
            }
        } catch (err) {
            // Parent handles error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="training-form bg-white p-4 rounded shadow mb-4">
            <h3 className="font-bold mb-2">{initialData ? "Editar Treino" : "Adicionar Novo Treino"}</h3>
            <div className="mb-2">
                <label className="block text-sm">Nome</label>
                <input className="border p-2 w-full" value={name} onChange={e => setName(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="mb-2">
                <label className="block text-sm">Descrição</label>
                <input className="border p-2 w-full" value={description} onChange={e => setDescription(e.target.value)} disabled={isLoading} />
            </div>
            <div className="mb-2">
                <label className="block text-sm">Data</label>
                <input className="border p-2 w-full" value={date} onChange={e => setDate(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="mb-2">
                <label className="block text-sm">Exercícios (separados por vírgula)</label>
                <input className="border p-2 w-full" value={exercisesInput} onChange={e => setExercisesInput(e.target.value)} disabled={isLoading} />
            </div>
            <div className="flex gap-2 mt-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isLoading}>
                    {isLoading ? (initialData ? "Salvando..." : "Adicionando...") : (initialData ? "Salvar Alterações" : "Adicionar Treino")}
                </button>
                {onCancel && <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel} disabled={isLoading}>Cancelar</button>}
            </div>
        </form>
    );
}

export default function LoggedInArea() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTraining, setEditingTraining] = useState<Training | null>(null);

    const token = getToken();

    const fetchTrainings = async () => {
        setIsLoading(true);
        try {
            if (!token) {
                toast.error("Autenticação necessária.");
                window.location.href = "/login";
                return;
            }
            const res = await fetch(`${API_BASE_URL}/trainings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Falha ao buscar treinos");
            const data = await res.json();
            setTrainings(data);
        } catch (err: any) {
            toast.error(err.message || "Erro ao buscar treinos.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainings();
        // eslint-disable-next-line
    }, []);

    const handleCreateTraining = async (trainingData: Omit<Training, "_id" | "createdAt" | "updatedAt">) => {
        try {
            const res = await fetch(`${API_BASE_URL}/trainings`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(trainingData),
            });
            if (!res.ok) throw new Error("Falha ao criar treino");
            const newTraining = await res.json();
            setTrainings([newTraining, ...trainings]);
            toast.success("Treino adicionado com sucesso!");
            setShowForm(false);
        } catch (err: any) {
            toast.error(err.message || "Erro ao criar treino.");
        }
    };

    const handleUpdateTraining = async (trainingData: Omit<Training, "_id" | "createdAt" | "updatedAt">) => {
        if (!editingTraining?._id) return;
        try {
            const res = await fetch(`${API_BASE_URL}/trainings/${editingTraining._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(trainingData),
            });
            if (!res.ok) throw new Error("Falha ao atualizar treino");
            const updated = await res.json();
            setTrainings(trainings.map(t => t._id === editingTraining._id ? updated : t));
            toast.success("Treino atualizado com sucesso!");
            setEditingTraining(null);
            setShowForm(false);
        } catch (err: any) {
            toast.error(err.message || "Erro ao atualizar treino.");
        }
    };

    const handleDeleteTraining = async (id: string) => {
        if (!window.confirm("Tem certeza que deseja deletar este treino?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/trainings/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Falha ao deletar treino");
            setTrainings(trainings.filter(t => t._id !== id));
            toast.success("Treino deletado com sucesso!");
        } catch (err: any) {
            toast.error(err.message || "Erro ao deletar treino.");
        }
    };

    const openEditForm = (training: Training) => {
        setEditingTraining(training);
        setShowForm(true);
    };

    const openCreateForm = () => {
        setEditingTraining(null);
        setShowForm(true);
    };

    if (isLoading) {
        return <div className="p-4">Carregando seus treinos...</div>;
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Meus Treinos</h2>
                <button onClick={openCreateForm} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Adicionar Novo Treino
                </button>
            </header>

            {showForm && (
                <div className="modal-form">
                    <TrainingForm
                        onSubmit={editingTraining ? handleUpdateTraining : handleCreateTraining}
                        initialData={editingTraining}
                        onCancel={() => { setShowForm(false); setEditingTraining(null); }}
                    />
                </div>
            )}

            {trainings.length > 0 ? (
                <ul className="divide-y">
                    {trainings.map((t) => (
                        <li key={t._id} className="py-3">
                            <h3 className="font-semibold">{t.name}</h3>
                            <p><strong>Descrição:</strong> {t.description}</p>
                            <p><strong>Data:</strong> {t.date}</p>
                            <p><strong>Exercícios:</strong> {t.exercises?.join(", ")}</p>
                            <p className="text-xs text-gray-500">
                                <small>Criado em: {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}</small><br />
                                <small>Atualizado em: {t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : "-"}</small>
                            </p>
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => openEditForm(t)} className="bg-gray-300 px-3 py-1 rounded">Editar</button>
                                <button onClick={() => handleDeleteTraining(t._id!)} className="bg-red-500 text-white px-3 py-1 rounded">Deletar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                !showForm && <p className="text-gray-500">Nenhum treino cadastrado ainda. Que tal adicionar um?</p>
            )}
        </div>
    );
}
