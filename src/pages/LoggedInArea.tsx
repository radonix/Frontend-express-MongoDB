import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoggedInArea.css"; // You can add your own styles here

const API_BASE_URL = "https://express-backend-example-jet.vercel.app";

type Exercise = {
  name: string;
  sets: number | "";
  reps: number | "";
  weight: number | "";
};

type Training = {
  _id?: string;
  name: string;
  description: string;
  date: string;
  exercises: Exercise[];
  createdAt?: string;
  updatedAt?: string;
};

function getToken() {
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    return window.localStorage.getItem("token") || "";
  }
  return "";
}

type TrainingFormProps = {
  onSubmit: (data: Omit<Training, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
  initialData?: Training | null;
  onCancel?: () => void;
};

const TrainingForm: React.FC<TrainingFormProps> = ({ onSubmit, initialData = null, onCancel }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [exercises, setExercises] = useState<Exercise[]>(
    initialData?.exercises?.map(ex => ({ ...ex })) || [{ name: "", sets: "", reps: "", weight: "" }]
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
    setDate(initialData?.date || "");
    setExercises(initialData?.exercises?.map(ex => ({ ...ex })) || [{ name: "", sets: "", reps: "", weight: "" }]);
  }, [initialData]);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", weight: "" }]);
  };

  const handleRemoveExercise = (index: number) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string) => {
    const newExercises = [...exercises];
    if (field === "sets" || field === "reps" || field === "weight") {
      newExercises[index][field] = value === "" ? "" : Number(value);
    }
    setExercises(newExercises);
  };

  const handleExerciseNameChange = (index: number, value: string) => {
    const newExercises = [...exercises];
    newExercises[index].name = value;
    setExercises(newExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formattedExercises = exercises.filter(ex => ex.name.trim() !== "");
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        date: date.trim(),
        exercises: formattedExercises.map(ex => ({
          name: ex.name.trim(),
          sets: typeof ex.sets === 'number' ? ex.sets : 0,
          reps: typeof ex.reps === 'number' ? ex.reps : 0,
          weight: typeof ex.weight === 'number' ? ex.weight : 0,
        })),
      });
      if (!initialData) {
        setName("");
        setDescription("");
        setDate("");
        setExercises([{ name: "", sets: "", reps: "", weight: "" }]);
      }
    } catch (err) {
      // Parent handles error
    } finally {
      setIsLoading(false);
    }
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
        <input type="date" style={{ border: "1px solid #ccc", padding: 8, width: "100%" }} value={date} onChange={e => setDate(e.target.value)} required disabled={isLoading} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 14 }}>Exercícios</label>
        {exercises.map((exercise, index) => (
          <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
            <input
              style={{ border: "1px solid #ccc", padding: 8, flex: 2 }}
              placeholder="Nome"
              value={exercise.name}
              onChange={e => handleExerciseNameChange(index, e.target.value)}
              disabled={isLoading}
              required
            />
            <input
              type="number"
              style={{ border: "1px solid #ccc", padding: 8, flex: 1 }}
              placeholder="Séries"
              value={exercise.sets}
              onChange={e => handleExerciseChange(index, "sets", e.target.value)}
              disabled={isLoading}
              min={1}
            />
            <input
              type="number"
              style={{ border: "1px solid #ccc", padding: 8, flex: 1 }}
              placeholder="Repetições"
              value={exercise.reps}
              onChange={e => handleExerciseChange(index, "reps", e.target.value)}
              disabled={isLoading}
              min={1}
            />
            <input
              type="number"
              style={{ border: "1px solid #ccc", padding: 8, flex: 1 }}
              placeholder="Peso (kg)"
              value={exercise.weight}
              onChange={e => handleExerciseChange(index, "weight", e.target.value)}
              disabled={isLoading}
              min={0}
            />
            {exercises.length > 1 && (
              <button type="button" onClick={() => handleRemoveExercise(index)} style={{ background: "#ef4444", color: "#fff", padding: "6px 8px", borderRadius: 4, border: "none" }}>
                Remover
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddExercise} style={{ background: "#16a34a", color: "#fff", padding: "8px 16px", borderRadius: 4, border: "none", marginTop: 8 }}>
          Adicionar Exercício
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button type="submit" style={{ background: "#2563eb", color: "#fff", padding: "8px 16px", borderRadius: 4, border: "none" }} disabled={isLoading}>
          {isLoading ? (initialData ? "Salvando..." : "Adicionando...") : (initialData ? "Salvar Alterações" : "Adicionar Treino")}
        </button>
        {onCancel && (
          <button type="button" style={{ background: "#e5e7eb", padding: "8px 16px", borderRadius: 4, border: "none" }} onClick={onCancel} disabled={isLoading}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

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
        if (typeof window !== "undefined" && window.location) {
          window.location.href = "/login";
        }
        return;
      }
      const res = await fetch(`${API_BASE_URL}/trainings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Falha ao buscar treinos");
      const data = await res.json();
      setTrainings(Array.isArray(data) ? data : data.trainings || []);
    } catch (err: any) {
      toast.error(err.message || "Erro ao buscar treinos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCreateTraining = async (trainingData: Omit<Training, "_id" | "createdAt" | "updatedAt">) => {
    if (!token) {
      toast.error("Autenticação necessária.");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/trainings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(trainingData),
      });
      if (!res.ok) throw new Error("Falha ao criar treino");
      await fetchTrainings();
      toast.success("Treino criado com sucesso!");
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar treino.");
    }
  };

  const handleUpdateTraining = async (trainingData: Omit<Training, "_id" | "createdAt" | "updatedAt">) => {
    if (!editingTraining?._id) return;
    if (!token) {
      toast.error("Autenticação necessária.");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return;
    }
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
    if (typeof window !== "undefined" && !window.confirm("Tem certeza que deseja deletar este treino?")) return;
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
    return (
      <>
        <div style={{ padding: 16 }}>Carregando seus treinos...</div>
        <ToastContainer aria-label="Notificações" />
      </>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: "bold" }}>Meus Treinos</h2>
        <button onClick={openCreateForm} style={{ background: "#2563eb", color: "#fff", padding: "8px 16px", borderRadius: 4, border: "none" }}>
          Adicionar Novo Treino
        </button>
      </header>

      {showForm && (
        <div>
          <TrainingForm
            onSubmit={editingTraining ? handleUpdateTraining : handleCreateTraining}
            initialData={editingTraining}
            onCancel={() => { setShowForm(false); setEditingTraining(null); }}
          />
        </div>
      )}

      {trainings.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {trainings.map((t, idx) => (
            <li key={t._id ?? idx} style={{ padding: "16px 0", borderBottom: "1px solid #eee" }}>
              <h3 style={{ fontWeight: "bold" }}>{t.name}</h3>
              <p><strong>Descrição:</strong> {t.description}</p>
              <p><strong>Data:</strong> {t.date}</p>
              <div>
                <strong>Exercícios:</strong>
                <ul>
                  {t.exercises.map((ex, exIdx) => (
                    <li key={exIdx}>
                      {ex.name} - {ex.sets} séries x {ex.reps} repetições {typeof ex.weight === "number" && ex.weight > 0 ? `(${ex.weight}kg)` : ""}
                    </li>
                  ))}
                </ul>
              </div>
              <p style={{ fontSize: 12, color: "#888" }}>
                <small>Criado em: {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}</small><br />
                <small>Atualizado em: {t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : "-"}</small>
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={() => openEditForm(t)} style={{ background: "#e5e7eb", padding: "6px 12px", borderRadius: 4, border: "none" }}>Editar</button>
                <button onClick={() => t._id && handleDeleteTraining(t._id)} style={{ background: "#ef4444", color: "#fff", padding: "6px 12px", borderRadius: 4, border: "none" }} disabled={!t._id}>Deletar</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !showForm && <p style={{ color: "#888" }}>Nenhum treino cadastrado ainda. Que tal adicionar um?</p>
      )}
      <ToastContainer aria-label="Notificações" />
    </div>
  );
}
