import {useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Barcode} from "@/components/JsonFileReader";
import TableRow from "@/components/TableRow";
import classes from "./InfiniteTable.module.css";

const InfiniteTable = ({barcodes}: { barcodes: Barcode[] }) => {
    const [items, setItems] = useState<Barcode[]>([]); // Текущие отображаемые данные
    const [allData, setAllData] = useState<Barcode[]>([]); // Все данные из файла
    const [page, setPage] = useState(1); // Текущая страница
    const [hasMore, setHasMore] = useState(true); // Есть ли ещё данные
    const limit = 50; // Количество строк за раз

    // Загрузка данных из файла
    useEffect(() => {
        setAllData(barcodes); // Сохраняем все данные
        setItems(barcodes.slice(0, limit)); // Первая порция
    }, []);

    // Функция подгрузки данных
    const loadMoreData = () => {
        const start = page * limit;
        const end = start + limit;
        const newItems = allData.slice(start, end);

        if (newItems.length === 0) {
            setHasMore(false); // Данных больше нет
            return;
        }

        setItems((prevItems) => [...prevItems, ...newItems]); // Добавляем новые строки
        setPage((prevPage) => prevPage + 1); // Увеличиваем страницу
    };

    return (
        <InfiniteScroll
            dataLength={items.length}
            next={loadMoreData}
            hasMore={hasMore}
            loader={<h4>Загрузка...</h4>}
            endMessage={<p>Все данные загружены!</p>}
        >
            <table className={classes.table}>
                <thead>
                <tr className="bg-sky-500/50">
                    <th>ID</th>
                    <th>Название</th>
                    <th>Level</th>
                </tr>
                </thead>
                <tbody>
                {items.map((barcode, index) => (
                    <TableRow key={index} id={index} barcode={barcode.Barcode} level={barcode.level}/>))
                }
                </tbody>
            </table>
        </InfiniteScroll>
    );
};

export default InfiniteTable;