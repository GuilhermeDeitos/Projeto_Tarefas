import { Header } from "./components/Header";
import { useState, useEffect } from "react";
import { Card } from "./components/Card";
import { api } from "./utils/api";
import "./globalStyle.css";
import Swal from "sweetalert2";
import type { AxiosError } from "axios";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [currentPages, setCurrentPages] = useState({
    Pending: 1,
    "InProgress": 1,
    Completed: 1,
  });

  const tasksPerPage = 2;

  const statusTypes = ["Pending", "InProgress", "Completed"];
  const statusColors = {
    Pending: "bg-red-300",
    "InProgress": "bg-purple-300",
    Completed: "bg-green-300",
  };

  const statusIcons = {
    Pending: "bi bi-hourglass-split",
    "InProgress": "bi bi-arrow-repeat",
    Completed: "bi bi-check-circle",
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/");
        setTasks(res.data);
        setFilteredTasks(res.data);
      } catch (err: unknown) {
        if ((err as AxiosError).response?.status !== 404) {
          setError(true);
        } 
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [searchTerm, tasks]);

  const translateStatus = (status: string) => {
    switch (status) {
      case "Pending":
        return "Pendente";
      case "InProgress":
        return "Em progresso";
      case "Completed":
        return "Concluído";
      default:
        return status;
    }
  };

  const handlePageChange = (status: string, direction: "next" | "prev") => {
    setCurrentPages((prev) => {
      const currentPage = prev[status as keyof typeof prev];
      const filtered = filteredTasks.filter((task) => task.status === status);
      const totalPages = Math.ceil(filtered.length / tasksPerPage);

      if (direction === "next" && currentPage < totalPages) {
        return { ...prev, [status]: currentPage + 1 };
      } else if (direction === "prev" && currentPage > 1) {
        return { ...prev, [status]: currentPage - 1 };
      }
      return prev;
    });
  };

  const handleCreateTask = () => {
    Swal.fire({
      title: "Criar nova tarefa",
      html: `
        <input id="title" class="swal2-input" placeholder="Título">
        <textarea id="description" class="swal2-textarea" placeholder="Descrição" maxlength=100></textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const title = (document.getElementById("title") as HTMLInputElement)
          .value;
        const description = (document.getElementById("description") as HTMLTextAreaElement)
          .value;
        return { title, description };
      },
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Criar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        const title = (document.getElementById("title") as HTMLInputElement)
          .value;
        const description = (document.getElementById("description") as HTMLTextAreaElement)
          .value;
        createTask(title, description);
      }
    });
  };
  const createTask = (title: string, description: string) => {
    if (title) {
      api
        .post("/", { title, description, status: "Pending" })
        .then(() => {
          Swal.fire("Criado!", "A tarefa foi criada.", "success");
          getAllTasks();
        })
        .catch((err) => {
          console.error(err);
          Swal.fire("Erro!", "Ocorreu um erro ao criar a tarefa.", "error");
        });
    } else {
      Swal.fire("Erro!", "O título da tarefa é obrigatório.", "error");
    }
  };

  const handleDragStart = (event: React.DragEvent, task: Task) => {
    event.dataTransfer.setData("task", JSON.stringify(task));
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (event: React.DragEvent, status: string) => {
    event.preventDefault();
    const taskData = event.dataTransfer.getData("task");
    const task: Task = JSON.parse(taskData);

    if (task.status !== status) {
      api
        .put(`/${task.id}`, { ...task, status })
        .then(() => {
          Swal.fire("Atualizado!", "A tarefa foi atualizada.", "success");
          getAllTasks();
        })
        .catch((err) => {
          console.error(err);
          Swal.fire("Erro!", "Ocorreu um erro ao atualizar a tarefa.", "error");
        });
    }
  };

  const getAllTasks = () => {
    api
      .get("/")
      .then((res) => {
        setTasks(res.data);
        setFilteredTasks(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  };

  if (loading) {
    return (
      <div className="bg-gray-900 h-screen text-slate-100 w-full flex justify-center items-center">
        <h1 className="text-3xl">Carregando...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 h-screen text-slate-100 w-full flex justify-center items-center">
        <h1 className="text-3xl">Erro ao carregar as tarefas</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 h-screen text-slate-100 w-full">
      <Header />
      <div className="m-1 flex items-end justify-between">
        <span>
          <input
            type="text"
            className="bg-gray-800 text-gray-100 px-4 py-2 rounded-l"
            placeholder="Pesquisar tarefa"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="bg-emerald-500 text-gray-100 px-4 py-2 mr-1 rounded-r cursor-pointer"
            onClick={handleCreateTask}
          >
            <i className="bi bi-plus-lg"></i> Criar nova tarefa
          </button>
        </span>
        <span>
          <i className="bi bi-info-circle"></i> Arraste a tarefa para mudar o
          status
        </span>
      </div>

      <div className="flex flex-row justify-center items-start gap-4 flex-wrap">
        {statusTypes.map((status) => {
          const filtered = filteredTasks.filter(
            (task) => task.status === status
          );
          const totalPages = Math.ceil(filtered.length / tasksPerPage);
          const currentPage = currentPages[status as keyof typeof currentPages];
          const paginatedTasks = filtered.slice(
            (currentPage - 1) * tasksPerPage,
            currentPage * tasksPerPage
          );
          if (paginatedTasks.length === 0) {
            return (
              <div
                key={status}
                className={`w-1/4 p-4`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, status)}
              >
                <h2 className="text-xl mb-4">
                  {translateStatus(status)}{" "}
                  <i
                    className={statusIcons[status as keyof typeof statusIcons]}
                  ></i>
                </h2>
                <div
                  className={`bg-gray-800 p-4 rounded-lg ${
                    statusColors[status as keyof typeof statusColors]
                  } overflow-y-auto max-h-[calc(100vh-200px)]`}
                >
                  <p className="text-center text-gray-800">
                    Nenhuma tarefa encontrada
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={status}
              className={`w-1/4 p-4`}
              onDragOver={(e) => e.preventDefault()} // Permite o drop
              onDrop={(e) => handleDrop(e, status)} // Lógica de drop
            >
              <h2 className="text-xl mb-4">
                {translateStatus(status)}{" "}
                <i
                  className={statusIcons[status as keyof typeof statusIcons]}
                ></i>
              </h2>
              <div
                className={`bg-gray-800 p-4 rounded-lg ${
                  statusColors[status as keyof typeof statusColors]
                } overflow-y-auto max-h-[calc(100vh-200px)]`}
              >
                {paginatedTasks.map((task) => (
                  <Card
                    key={task.id}
                    task={task}
                    draggable // Torna o card arrastável
                    onDragStart={(e) => handleDragStart(e, task)} // Evento de início do drag
                  />
                ))}
              </div>
              <div className="flex justify-center mt-4 items-center">
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-l cursor-pointer"
                  onClick={() => handlePageChange(status, "prev")}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span className="mx-2 text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-r cursor-pointer"
                  onClick={() => handlePageChange(status, "next")}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
