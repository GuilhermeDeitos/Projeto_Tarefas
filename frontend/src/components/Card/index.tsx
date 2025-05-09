import type { Task } from "../../App";
import Swal from "sweetalert2";
import { api } from "../../utils/api";

interface CardProps {
  task: Task;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent) => void;
}

export function Card({ task, draggable = false, onDragStart }: CardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleDeleteTask = (taskId: number) => {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Essa ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`/${taskId}`)
          .then(() => {
            Swal.fire("Excluído!", "A tarefa foi excluída.", "success");
            // Aguarda 1 segundo para atualizar a página
            setTimeout(() => {
              window.location.reload();
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            Swal.fire("Erro!", "Ocorreu um erro ao excluir a tarefa.", "error");
          });
      }
    });
  };

  const handleEditTask = (taskId: number) => {
    Swal.fire({
      title: "Editar tarefa",
      html: `
        <input id="title" class="swal2-input" placeholder="Título" value="${task.title}">
        <textarea id="description" class="swal2-textarea" placeholder="Descrição" maxlength=100>${task.description}</textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const title = task.title;
        const description = task.description;
        return { title, description };
      },
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Salvar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        const title = (document.getElementById("title") as HTMLInputElement)
          .value;
        const description = (
          document.getElementById("description") as HTMLTextAreaElement
        ).value;
        api
          .put(`/${taskId}`, { title, description })
          .then(() => {
            Swal.fire("Salvo!", "A tarefa foi editada.", "success");
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
            Swal.fire("Erro!", "Ocorreu um erro ao editar a tarefa.", "error");
          });
      }
    });
  };

  const formattedDate = formatDate(task.createdAt);

  const formatDescription = (description: string, maxLength: number) => {
    const regex = new RegExp(`.{1,${maxLength}}`, "g");
    return description.match(regex) || [];
  };

  return (
    <div
      className="p-7 border-2 border-slate-600 rounded-lg bg-gray-800 m-auto flex flex-col items-center mb-2"
      draggable={draggable} 
      onDragStart={onDragStart} 
    >
      <div className="flex flex-row justify-between items-center w-full mb-4">
        <p className="text-sm text-gray-400">
          <i className="bi bi-calendar"></i> {formattedDate}
        </p>
        <span className="">
          <i
            className="bi bi-pencil-square cursor-pointer"
            onClick={handleEditTask.bind(null, task.id)}
          ></i>
          <i
            className="bi bi-trash cursor-pointer"
            onClick={handleDeleteTask.bind(null, task.id)}
          ></i>
        </span>
      </div>
      <h3 className="text-xl font-bold">{task.title}</h3>
      <div className="w-full h-0.5 bg-gray-600 my-2"></div>
      <p className="text-gray-400 text-sm">{
        formatDescription(task.description,35).map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
        </p>
    </div>
  );
}