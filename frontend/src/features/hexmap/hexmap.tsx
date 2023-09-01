import { useEffect, useRef, useState } from "react";

const hexPointsFlat: { relX: number, relY: number }[] = [];
for (let i = 0; i < 6; i++) {
    hexPointsFlat.push({
        relX: Math.cos(i * Math.PI/3),
        relY: Math.sin(i * Math.PI/3)
    });
}
const hexPointsPointy: { relX: number, relY: number }[] = [];
for (let i = 0; i < 6; i++) {
    hexPointsPointy.push({
        relX: Math.cos((i - .5) * Math.PI/3),
        relY: Math.sin((i - .5) * Math.PI/3)
    });
}

const draw = (context: CanvasRenderingContext2D, hexs: IGridHex[], hexMapOptions: IHexMapOptions): void => {

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    for (const hex of hexs) {
        drawHex(context, hex, hexMapOptions);
    }
}

const drawHex = (ctx: CanvasRenderingContext2D, hex: IGridHex, hexMapOptions: IHexMapOptions): void => {
    const centerPoint = gridPositionToCenterPoint(hex.x, hex.y, hexMapOptions);
    ctx.save();
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.fillStyle = hex.color || "rgba(0,0,0,0)";
    const hexPoints = hexMapOptions.orientation === "flattop" ? hexPointsFlat : hexPointsPointy;
    ctx.moveTo(hexPoints[0].relX * hexMapOptions.hexSize + centerPoint.x, hexPoints[0].relY * hexMapOptions.hexSize + centerPoint.y);
    for (let i = 1; i < 6; i++) {
        ctx.lineTo(hexPoints[i].relX * hexMapOptions.hexSize + centerPoint.x, hexPoints[i].relY * hexMapOptions.hexSize + centerPoint.y)
    }
    ctx.closePath();
    if (hex.color !== null) {
        ctx.fill();
    }
    ctx.stroke();
    ctx.restore();
}

const gridPositionToCenterPoint = (gridX: number, gridY: number, hexMapOptions: IHexMapOptions): { x: number, y: number } => {
    const result = { x: 0, y: 0 };
    const sqrt3 = Math.sqrt(3);
    const size = hexMapOptions.hexSize;
    if (hexMapOptions.orientation === "flattop") {
        result.x = gridX * 1.5 * size + size;
        result.y = gridY * sqrt3 * size + sqrt3 * size;
        if ((hexMapOptions.offset === "even" && gridX % 2 === 0)
            || (hexMapOptions.offset === "odd" && gridX % 2 === 1)) {
            result.y += (sqrt3 * size / 2);
        }
    } else {
        result.x = gridX * sqrt3 * size + sqrt3 * size;
        result.y = gridY * 1.5 * size + size;
        if ((hexMapOptions.offset === "even" && gridY % 2 === 0)
            || (hexMapOptions.offset === "odd" && gridY % 2 === 1)) {
            result.x += (sqrt3 * size / 2);
        }
    }
    return result;
}

type IHexMapProps = Partial<IHexMapOptions> & { hexs?: IGridHex[] }

const HexMap: React.FC<IHexMapProps> = (props: IHexMapProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let initialHexs: IGridHex[] = [];
    for (let x = 0; x < 20; x++) {
        for (let y = 0; y < 20; y++) {
            initialHexs.push({
                x, y, 
                color: null
                // color: `rgba(${x * 10 + 55},${y * 10 + 55},0,1)`
            });
        }
    }
    const [hexs] = useState<IGridHex[]>(props.hexs || initialHexs);


    useEffect(() => {
        if (canvasRef.current === null) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
        const hexMapOptions: IHexMapOptions = {
            hexSize: props.hexSize || 25,
            offset: props.offset || "odd",
            orientation: props.orientation || "flattop"
        };

        draw(context, hexs, hexMapOptions);
    }, [hexs, props]);

    return <div>
        <canvas ref={canvasRef} width="1000" height="1000">Map goes here</canvas>
    </div>;
}

export default HexMap;

interface IGridHex {
    x: number;
    y: number;
    color: string | null;
}

interface IHexMapOptions {
    hexSize: number;
    orientation: "flattop" | "pointytop";
    offset: "even" | "odd"
}