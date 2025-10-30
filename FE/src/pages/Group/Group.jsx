    import { Dropdown, Button, Spin, Avatar, Tooltip as AntdTooltip,Divider } from 'antd';
    import { useParams } from "react-router-dom";
    import { API_PATH } from "../../utils/apiPath";
    import instance from "../../utils/instance";
    import React, {useEffect, useState, useMemo} from "react"
    import LineChartLayout from "../../components/LineChart"
    import DropDown from "../../components/DropDown";
    import StackChart from "../../components/StackChart";
    import AddTransModal from '../../components/AddTransModal';
    import DataList from '../../components/DataList';
    import InviteModal from '../../components/InviteModal'; 

    const periodItems = [{ label: "Last 7 Days", key: "7d" }, { label: "Last Month", key: "1m" }, { label: "Last 3 Months", key: "3m" }, { label: "Last Year", key: "1y" }];
    const dataTypeItems = [{ label: "Surplus", key: "surplus" }, { label: "Income", key: "income" }, { label: "Expense", key: "expense" }];
    const summaryTypeItems = [{ label: "Daily", key: "GET_DAILY_GROUP" }, { label: "Add Up", key: "GET_ADD_UP_GROUP" }];

    const GroupDashboardPage = () => {
        const { groupId } = useParams();
        const [group, setGroup] = useState(null);
        const [lineChartData, setLineChartData] = useState([]);
        const [loading, setLoading] = useState(true);
        const [period, setPeriod] = useState(periodItems[1]); 
        const [dataType, setDataType] = useState(dataTypeItems[0]);
        const [summaryType, setSummaryType] = useState(summaryTypeItems[0]);
        const [memberProportions, setMemberProportions] = useState({ income: [], expense: [] });
        const [isModalTransVisible, setIsModalTransVisible] = useState(false);
        const [transactionList, setTransactionList] = useState([]);
        const [isModalInviteVisible, setIsModalInviteVisible] = useState(false);

        const openTransModal = () => {
            setIsModalTransVisible(true);
        };

        const closeTransModal = () => {
            setIsModalTransVisible(false);
        };

        const openInviteModal = () => {
            setIsModalInviteVisible(true);
        };

        const closeInviteModal = () => {
            setIsModalInviteVisible(false);
        };

        const handleAddTransaction = (values) => {
            instance.post(`${API_PATH.TRANSACTION.CREATE}?groupId=${groupId}`, values)
                .then((response) => {
                    setIsModalTransVisible(false);
                    window.location.reload();
                    fetchData();
                })
                .catch((error) => {
                    console.error("Error adding transaction:", error);
                });
        };   

        useEffect(() => {
            const fetchData = async () => {
                if (!groupId) return;
                setLoading(true);
                try {
                    const [detailsRes, dailyRes, memberPropRes, transactionRes] = await Promise.all([
                        instance.get(`${API_PATH.GROUP.GET_GROUP}${groupId}`),
                        instance.get(`${API_PATH.DASHBOARD[summaryType.key]}${groupId}?period=${period.key}`),
                        instance.get(`${API_PATH.DASHBOARD.GET_PROPORTION_GROUP}${groupId}`),
                        instance.get(`${API_PATH.TRANSACTION.GET_GROUP_TRANSACTION}${groupId}?period=${period.key}`),
                    ]);

                    if (detailsRes?.data?.data) setGroup(detailsRes.data.data);
                    if (dailyRes?.data?.data) setLineChartData(dailyRes.data.data);
                    if (memberPropRes?.data?.data) setMemberProportions(memberPropRes.data.data);
                    if (transactionRes?.data?.data) setTransactionList(transactionRes.data.data);

                } catch (error) {
                    console.error("Error fetching group data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [groupId, period, summaryType]);

        const memberComparisonData = useMemo(() => {
            const dataMap = new Map();
            memberProportions.income.forEach(item => {
                if (!dataMap.has(item.name)) {
                    dataMap.set(item.name, { name: item.name, income: 0, expense: 0 });
                }
                dataMap.get(item.name).income += item.value;
            });
            memberProportions.expense.forEach(item => {
                if (!dataMap.has(item.name)) {
                    dataMap.set(item.name, { name: item.name, income: 0, expense: 0 });
                }
                dataMap.get(item.name).expense += item.value;
            });

            return Array.from(dataMap.values());
        }, [memberProportions]);

        const formattedLineData = useMemo(() => lineChartData.map(item => {
            const dateObj = new Date(item.date);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            return { ...item, date: `${day}/${month}` };
        }), [lineChartData]);

        if (loading && !group) { 
            return <div className="flex justify-center items-center h-full"><Spin size="large" /></div>;
        }

        if (!group) {
            return <div>Cant find group!</div>;
        }

        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">{group.name}</h1>
                        <div className="flex items-center mt-2">
                            <span className="mr-2">Memebers: </span>
                            <Avatar.Group>
                                {group.members.map(member => (
                                    <AntdTooltip key={member._id} title={member.username}>
                                        <Avatar>{member.profilePic ? <img src={member.profilePic} alt="" /> : "?"}</Avatar>
                                    </AntdTooltip>
                                ))}
                            </Avatar.Group>
                        </div>
                    </div>
                    <div className="pt-9 w-1/8">
                        <Button onClick={openInviteModal} type="primary" className="hover:shadow-md hover:shadow-blue-200 transition-all duration-300 mb-4 " block>Invite</Button>
                    </div>
                </div>
                
                {loading ? <Spin /> : (
                    <>
                        <div className="flex items-center justify-center">
                            <LineChartLayout data={formattedLineData} titles={[{ dataKey: dataType.key }]}>
                                <div className="flex items-center gap-4">
                                    <DropDown title={period.label} items={periodItems} onSelect={(key) => setPeriod(periodItems.find(item => item.key === key))} />
                                    <DropDown title={dataType.label} items={dataTypeItems} onSelect={(key) => setDataType(dataTypeItems.find(item => item.key === key))} />
                                    <DropDown title={summaryType.label} items={summaryTypeItems} onSelect={(key) => setSummaryType(summaryTypeItems.find(item => item.key === key))}/>
                                </div>
                            </LineChartLayout>
                        </div>
                        <Divider/>
                        <div className="mt-8 mb-10">
                            <StackChart data={memberComparisonData} title="Members's Income and Expense"/>
                        </div>
                        <DataList data={transactionList} periodLabel={period.label}>
                            <Button onClick={openTransModal} className="hover:shadow-md hover:shadow-blue-200 transition-all duration-300 mb-4">Add Transaction</Button>
                        </DataList>
                    </>
                )}
                
                <AddTransModal
                    visible={isModalTransVisible}
                    onCancel={closeTransModal}
                    onSubmit={handleAddTransaction}
                />
                <InviteModal
                    visible={isModalInviteVisible}
                    onCancel={closeInviteModal}
                    groupId={groupId}
                />
            </div>
        );
    };

    export default GroupDashboardPage;