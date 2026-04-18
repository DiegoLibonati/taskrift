import "@/index.css";
import TaskriftPage from "@/pages/TaskriftPage/TaskriftPage";

const onInit = (): void => {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) throw new Error(`You must render a container to mount the app.`);

  const taskriftPage = TaskriftPage();
  app.appendChild(taskriftPage);
};

document.addEventListener("DOMContentLoaded", onInit);
