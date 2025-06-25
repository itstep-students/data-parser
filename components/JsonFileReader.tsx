'use client'
import {useRef, useState} from 'react';
import InfiniteTable from "@/components/InfiniteTable";
import Loader from "@/components/loader";

export interface Barcode {
    "Barcode": string;
    "level": number
}

export default function JsonFileReader() {
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [jsonDataBarcodes, setJsonDataBarcodes] = useState<Barcode[] | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setFileName(file.name);

        if (file.type !== 'application/json') {
            setError('Пожалуйста, выберите JSON файл');
            return;
        }

        try {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target?.result as string);
                    setJsonDataBarcodes(jsonData.TaskMarks[0].Barcodes);
                } catch {
                    setError('Ошибка при разборе JSON файла');
                    setJsonDataBarcodes(null);
                }
            };

            reader.onerror = () => {
                setError('Ошибка при чтении файла');
                setJsonDataBarcodes(null);

            };

            reader.readAsText(file, 'utf8');
        } catch {
            setError('Произошла ошибка при обработке файла');
            setJsonDataBarcodes(null);

        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col gap-2 w-6xl mx-auto mt-2.5">
            <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
            />
            <button
                onClick={triggerFileSelect}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Выбрать JSON файл
            </button>
            {fileName && (
                <p className="text-sm text-gray-800 bg-orange-200 mb-2.5">
                    Выбран файл: {fileName}
                </p>
            )}
            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}
            {jsonDataBarcodes && (
                <InfiniteTable barcodes={jsonDataBarcodes}/>
            )}
            {!jsonDataBarcodes && fileName && (<Loader/>)}
        </div>
    );
}