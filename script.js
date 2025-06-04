const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let currentTool = "pen";
let penColor = "#3B3B1A"
const undoStack = [];

function saveState() {
    undoStack.push(canvas.toDataURL());
}

function setColor(color){
    penColor = color;
}

function setTool(tool) {
    currentTool = tool;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveImage() {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");

    link.href = dataURL;
    link.download = "whiteboard.png";
    link.click();
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function undo() {
    if (undoStack.length === 0)
        return;

    const prevState = undoStack.pop();
    const img = new Image();
    img.src = prevState;
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    }
}

// shortcut listeners
document.addEventListener("keydown", (e) => {
    if (e.key === "u") {
        if (undoStack.length === 0) // last undo
            clearCanvas();
        else
            undo();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "p")
        setTool("pen");
});

document.addEventListener("keydown", (e) => {
    if (e.key === "e")
        setTool("eraser");
});

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "c")
        clearCanvas();
});

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveImage();
    }
});

// mouse movement listeners
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    const pos = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);

    if (currentTool === "pen") {
        ctx.strokeStyle = penColor;
        ctx.lineWidth = 0.21;
    } else if (currentTool === "eraser") {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 20;
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    saveState();
});

canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
});
