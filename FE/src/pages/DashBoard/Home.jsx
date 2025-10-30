import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import instance from "../../utils/instance";
import { API_PATH } from "../../utils/apiPath.js";
import LineChartLayout from "../../components/LineChart.jsx";
import PieChartLayout from "../../components/PieChart.jsx";
import DropDown from "../../components/DropDown";
import DataList from "../../components/DataList.jsx";
import { Divider, Button,Spin } from "antd";
import AddTransModal from "../../components/AddTransModal"; 

const periodItems = [{ label: "Last 7 Days", key: "7d" }, { label: "Last Month", key: "1m" }, { label: "Last 3 Months", key: "3m" }, { label: "Last Year", key: "1y" }];
const dataTypeItems = [{ label: "Surplus", key: "surplus" }, { label: "Income", key: "income" }, { label: "Expense", key: "expense" }];
const summaryTypeItems = [{ label: "Daily", key: "GET_DAILY_SUMMARY" }, { label: "Add Up", key: "GET_ADD_UP_SUMMARY" }];

const Home = () => {
    const [transactionList,setTransactionList] = useState([]);
    const [lineChartData, setLineChartData] = useState([]);
    const [categoryData, setCategoryData] = useState({ income: [], expense: [] });
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState(periodItems[1]);
    const [dataType, setDataType] = useState(dataTypeItems[0]);
    const [summaryType, setSummaryType] = useState(summaryTypeItems[0]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const handleAddTransaction = (values) => {
        instance.post(API_PATH.TRANSACTION.CREATE, values)
            .then((response) => {
                setIsModalVisible(false);
                console.log(response);
                fetchData();
            })
            .catch((error) => {
                console.error("Error adding transaction:", error);
            });
    };  

    const handleDownload = () => {
        instance.get(`${API_PATH.TRANSACTION.DOWNLOAD_EXCEL}?period=${period.key}`,{
            responseType:'blob'
        }).then((response)=>{
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'transactions.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const [dailyRes, categoryRes, transactionRes] = await Promise.all([
                instance.get(`${API_PATH.DASHBOARD[summaryType.key]}?period=${period.key}`),
                instance.get(`${API_PATH.DASHBOARD.GET_CATEGORY_SUMMARY}?period=${period.key}`),
                instance.get(`${API_PATH.TRANSACTION.GET_TRANSACTION}?period=${period.key}`),
            ]);

            console.log(transactionRes.data.data);
            if (dailyRes?.data?.data) {
                setLineChartData(dailyRes.data.data);
            }
            if (categoryRes?.data?.data) {
                setCategoryData(categoryRes.data.data);
            }
            if (transactionRes?.data?.data) {
                setTransactionList(transactionRes.data.data);
            }
        } catch (error) {
            console.error("Error fetching chart data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [period, summaryType]);

    const formattedLineData = useMemo(() => {
        return lineChartData.map(item => {
            const dateObj = new Date(item.date);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            return {
                ...item,
                date: `${day}/${month}`,
            };
        });
    }, [lineChartData]);

    return (
        <>
            {loading ? <Spin/> : (
                <>
                    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
                    <div className="flex items-center justify-center">
                        <LineChartLayout data={formattedLineData} titles={[{ dataKey: dataType.key }]} >
                            <div className="items-center justify-end mb-4 flex gap-2">
                                <DropDown
                                    title={period.label}
                                    items={periodItems}
                                    onSelect={(key) => setPeriod(periodItems.find(item => item.key === key))}
                                />
                                <DropDown
                                    title={summaryType.label}
                                    items={summaryTypeItems}
                                    onSelect={(key) => setSummaryType(summaryTypeItems.find(item => item.key === key))}
                                />
                                <DropDown
                                    title={dataType.label}
                                    items={dataTypeItems}
                                    onSelect={(key) => setDataType(dataTypeItems.find(item => item.key === key))}
                                />
                            </div>
                        </LineChartLayout>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <PieChartLayout data={categoryData.income} title="Income Proportion" />
                        <PieChartLayout data={categoryData.expense} title="Expense Proportion" />
                    </div>
                    <div className="mt-10">
                        <Divider/>
                    </div>
                    <DataList data={transactionList} periodLabel={period.label}>
                        <Button onClick={openModal} className="hover:shadow-md hover:shadow-blue-200 transition-all duration-300 mb-4">Add Transaction</Button>
                        <Button onClick={handleDownload} className="hover:shadow-md hover:shadow-blue-200 transition-all duration-300 mb-4">Download Excel</Button>
                    </DataList>
                </>
            )}
            <AddTransModal visible={isModalVisible} onCancel={closeModal} onSubmit={handleAddTransaction} />
        </>
    );
};

export default Home;
