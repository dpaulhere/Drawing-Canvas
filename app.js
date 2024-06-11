// app.js
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    let painting = false;
    let brushSize = 5;
    let brushColor = '#000000';
    let customCursor = '';
    let history = [];
    let historyStep = -1;

    const updateHistory = () => {
        if (historyStep < history.length - 1) {
            history.length = historyStep + 1;
        }
        history.push(canvas.toDataURL());
        historyStep++;
    };

    const startPainting = (e) => {
        painting = true;
        draw(e);
        updateHistory();
    };

    const endPainting = () => {
        painting = false;
        ctx.beginPath();
    };

    const draw = (e) => {
        if (!painting) return;
        const pressure = e.pressure || 0.5; // Default pressure if not provided
        ctx.lineWidth = brushSize * pressure;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;
    
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    };
    
    canvas.addEventListener('pointerdown', startPainting);
    canvas.addEventListener('pointerup', endPainting);
    canvas.addEventListener('pointermove', draw);

    document.getElementById('undo').addEventListener('click', () => {
        if (historyStep > 0) {
            historyStep--;
            let img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = history[historyStep];
        }
    });

    document.getElementById('redo').addEventListener('click', () => {
        if (historyStep < history.length - 1) {
            historyStep++;
            let img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = history[historyStep];
        }
    });

    document.getElementById('color-picker').addEventListener('change', (e) => {
        brushColor = e.target.value;
    });

    document.getElementById('brush-size').addEventListener('input', (e) => {
        brushSize = e.target.value;
    });

    document.getElementById('brush-design').addEventListener('change', function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            customCursor = `url(${event.target.result}) ${brushSize / 2} ${brushSize / 2}, auto`;
            canvas.style.cursor = customCursor;
        };
        reader.readAsDataURL(file);
    });
});
