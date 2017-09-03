(function () {
    // vars
    var mousePos = {};
    var drawing = false;
    var color = "#000"
    var size = 5;
    var colors = [];
    var updateColors = true;

    //create svg settings
    var standard = 'http://www.w3.org/2000/svg';

    var canvas = document.getElementById('canvas');
    var svg = document.createElementNS(standard, 'svg');

    svg.classList.add('svg');
    svg.style.height = canvas.clientHeight;
    svg.style.width = canvas.clientWidth;

    canvas.appendChild(svg);

    // Set new mouse coordinates
    function setPos(evt) {
        var offset = svg.getBoundingClientRect();

        mousePos = {
            top: evt.pageY - offset.top,
            left: evt.pageX - offset.left
        };
    }

    // Draw on the Canvas
    function draw(from, to) {
        if (typeof from.top !== 'undefined' && typeof to.top !== 'undefined') {
            if (size < 2)
                drawCircle(from)
            drawLine(from, to);
        } else if (typeof from.top !== 'undefined' || typeof to.top !== 'undefined') {
            drawCircle(typeof from.top !== 'undefined' ? from : to);

        } else {
            console.error('Mouse pos not set');
        }
    }
    // Draw Circle function for start and end
    function drawCircle(p) {

        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        
        var diameter = (size - 1) ? size - 1 : 1;

        circle.setAttribute('cx', p.left);
        circle.setAttribute('cy', p.top);
        circle.setAttribute('r', (diameter - 1) / 2 + 'px');

        circle.style.fill = color;
        circle.style.stroke = color;

        svg.appendChild(circle);
    }
    // Draw lines when you move the mouse
    function drawLine(from, to) {
        
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', from.left);
        line.setAttribute('y1', from.top);

        line.setAttribute('x2', to.left);
        line.setAttribute('y2', to.top);

        line.style.stroke = color;
        line.style.strokeWidth = size + 'px';

        drawCircle(from);
        svg.appendChild(line);
    }

    // Mouse listeners on canvas
    svg.addEventListener('mousedown', function (evt) {
        drawing = true;
        setPos(evt);
        draw(mousePos, {});
    });
    svg.addEventListener('mouseup', function (evt) {
        if (drawing)
            draw(mousePos, {});
        mousePos = {};
        drawing = false;
    });
    svg.addEventListener('mouseleave', function (evt) {
        if (drawing)
            draw(mousePos, {});
        mousePos = {};
        drawing = false;
    });
    svg.addEventListener('mousemove', function (evt) {
        if (drawing) {
            var pos = mousePos;
            setPos(evt);
            draw(pos, mousePos);
        }
    });

    // Wipe Canvas
    document.getElementById('clear').addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        svg.innerHTML = '';
    });

    // Set brush size
    document.getElementById('size').addEventListener('change', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        size = Math.abs(parseInt(event.target.value, 10));
        if (!size) {
            size = 1;
        }
        evt.target.value = size;
    });

    // set color 
    document.getElementById('color').addEventListener('change', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        color = evt.target.value;
        if(updateColors){
            AddColorBtn(color);
        }
        updateColors = true;
    });

    //Last colors used
    function AddColorBtn(color) {
        var elem = document.createElement('li');
        elem.classList.add('colorize');
        elem.setAttribute('color', color);
        elem.style.background = color;

        document.getElementById('last-colors').appendChild(elem);

        colors.push(elem);
        if (colors.length > 5){
            var last = colors.shift();
            last.remove();
        }
    }

    document.getElementById('last-colors').addEventListener('click', function(evt) {
        if (evt.target.classList.value === 'colorize') {
            updateColors = false;
            var input = document.getElementById('color');
            input.value = evt.target.getAttribute('color');

            var event = new Event('change');
            input.dispatchEvent(event);
        }
    });

        // extend canvas on resize
        window.addEventListener('resize', function (evt) {
            if (canvas.clientHeight > svg.clientHeight) {
                svg.style.height = canvas.clientHeight;
            }
            if (canvas.clientWidth > svg.clientWidth) {
                svg.style.width = canvas.clientWidth;
            }
        });
})();