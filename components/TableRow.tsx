import classes from './TableRow.module.css'

export default function TableRow({id, barcode, level}: { id: number; barcode: string; level: number }) {
    function barcodeFormater(barcode: string) {
        return barcode.replace(/\u001d/g, "[GS]");
    }

    return (
        <tr className={id % 2 !== 0 ? classes.odd : undefined}>
            <td>{id}</td>
            <td>{barcodeFormater(barcode)}</td>
            <td>{level}</td>
        </tr>
    );
}