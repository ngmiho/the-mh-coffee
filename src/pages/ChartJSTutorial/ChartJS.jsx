import React, { useEffect, useState } from "react";
import { format as dateFormat } from "date-fns";
import { Button, Card, DatePicker, Space, Statistic, Table } from "antd";
import { NumericFormat } from "react-number-format";
import LineChart from "../../components/Chart/LineChart";
import BarChart from "../../components/Chart/BarChart";
import {
  fetchGetRevenueByDate,
  fetchGetRevenueByDrink,
} from "../../services/ReportService";
import { ExportToExcel } from "../../utils/ExportToExcel";
import { toast } from "react-toastify";
import {
  CoffeeOutlined,
  DollarCircleOutlined,
  FileExcelOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;

const ChartJS = () => {
  const [revenueByDrink, setRevenueByDrink] = useState([]);
  const [revenueByDate, setRevenueByDate] = useState([]);
  const [dates, setDates] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalDrink, setTotalDrink] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [barChartData, setBarChartData] = useState({
    labels: "",
    datasets: [],
  });
  const [lineChartData, setLineChartData] = useState({
    labels: "",
    datasets: [],
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const getRevenueByDrink = async () => {
    const today = new Date();
    const startDate = dateFormat(today, "yyyy-MM-dd").toString() + " 00:00:00";
    const endDate = dateFormat(today, "yyyy-MM-dd").toString() + " 23:59:59";

    let res;

    if (dates === null) {
      setDates({ startDate: startDate, endDate: endDate });
    }

    if (dates) {
      res = await fetchGetRevenueByDrink(dates.startDate, dates.endDate);
    }

    if (res && res.result) {
      const data = res.result.map((result, index) => ({
        ...result,
        key: index + 1,
      }));

      console.log("Revenue by drink data: ", data);

      setRevenueByDrink(data);
    }
  };

  const getRevenueByDate = async () => {
    const today = new Date();
    const startDate = dateFormat(today, "yyyy-MM-dd").toString() + " 00:00:00";
    const endDate = dateFormat(today, "yyyy-MM-dd").toString() + " 23:59:59";
    console.log(startDate);
    console.log(endDate);

    let res;

    if (dates === null) {
      setDates({ startDate: startDate, endDate: endDate });
    }

    if (dates) {
      res = await fetchGetRevenueByDate(dates.startDate, dates.endDate);
    }

    if (res && res.result) {
      const data = res.result.map((result, index) => ({
        ...result,
        key: index + 1,
      }));

      console.log("Revenue by date data: ", data);
      setRevenueByDate(data);
    }
  };

  useEffect(() => {
    getRevenueByDrink();
    getRevenueByDate();
  }, [dates]);

  useEffect(() => {
    const revenueByDrink_y = revenueByDrink.map((report) => report.revenue);
    const revenueByDrink_x = revenueByDrink.map((report) => report.drink.name);

    const revenueByDrink_quantity = revenueByDrink.map(
      (report) => report.quantity
    );

    const totalDrink = revenueByDrink_quantity.reduce(
      (total, value) => total + value,
      0
    );

    setTotalDrink(totalDrink);

    setBarChartData({
      labels: revenueByDrink_x,
      datasets: [
        {
          label: "Revenue",
          data: revenueByDrink_y,
          backgroundColor: "rgb(255, 255, 0, 0.5)",
        },
      ],
    });
  }, [revenueByDrink]);

  useEffect(() => {
    const revenueByDate_y = revenueByDate.map((report) => report.revenue);
    const revenueByDate_x = revenueByDate.map((report) =>
      dateFormat(report.date, "dd/MM")
    );

    const totalRevenue = revenueByDate_y.reduce(
      (total, value) => total + value,
      0
    );

    setTotalRevenue(totalRevenue);

    const ordersByDate = revenueByDate.map((report) => report.numberOfOrders);

    const totalOrders = ordersByDate.reduce((total, value) => total + value, 0);

    setTotalOrders(totalOrders);

    setLineChartData({
      labels: revenueByDate_x,
      datasets: [
        {
          label: "Revenue",
          data: revenueByDate_y,
          backgroundColor: "rgb(0, 255, 0, 0.25)",
          borderColor: "rgb(0, 255, 0, 0.5)",
          tension: 0.5,
        },
      ],
    });
  }, [revenueByDate]);

  const handleExportToExcel = async (chartData) => {
    if (chartData === revenueByDate && revenueByDate.length > 0) {
      const exportData = revenueByDate.map((data, index) => ({
        STT: index + 1,
        Date: dateFormat(data.date, "dd/MM/yyyy"),
        Revenue: data.revenue,
        NumberOfOrders: data.numberOfOrders,
      }));

      const startDate = dateFormat(dates.startDate, "ddMM");
      const endDate = dateFormat(dates.endDate, "ddMMyyyy");

      console.log("Export Data: ", exportData);
      await ExportToExcel.exportToExcel(
        exportData,
        "Thống kê doanh thu",
        `RevenueByDate_${startDate}_${endDate}`
      );

      toast.success("Report Data is export to excel successfully");
    } else if (chartData === revenueByDrink && revenueByDrink.length > 0) {
      const exportData = revenueByDrink.map((data, index) => ({
        STT: index + 1,
        DrinkName: data.drink.name,
        Revenue: data.revenue,
        Quantity: data.quantity,
      }));

      const startDate = dateFormat(dates.startDate, "ddMM");
      const endDate = dateFormat(dates.endDate, "ddMMyyyy");

      console.log("Export Data: ", exportData);
      await ExportToExcel.exportToExcel(
        exportData,
        "Thống kê theo thức uống",
        `RevenueByDrink_${startDate}_${endDate}`
      );

      toast.success("Report Data is export to excel successfully");
    } else {
      toast.error("Report Data is empty");
    }
  };

  const columnsOfRevenueTable = [
    {
      title: "#",
      dataIndex: "key",
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date) => <>{dateFormat(date, "dd/MM/yyyy")}</>,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      render: (revenue) => (
        <NumericFormat
          value={revenue}
          displayType="text"
          thousandSeparator=","
          suffix=" đ"
        />
      ),
      sorter: (firstRecord, secondRecord) =>
        firstRecord.revenue - secondRecord.revenue,
    },
    {
      title: "Number of Orders",
      dataIndex: "numberOfOrders",
      sorter: (firstRecord, secondRecord) =>
        firstRecord.numberOfOrders - secondRecord.numberOfOrders,
    },
  ];

  const columnsOfDrinkTable = [
    {
      title: "#",
      dataIndex: "key",
    },
    {
      title: "Drink Name",
      dataIndex: "drink",
      render: (drink) => <>{drink.name}</>,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      render: (revenue) => (
        <NumericFormat
          value={revenue}
          displayType="text"
          thousandSeparator=","
          suffix=" đ"
        />
      ),
      sorter: (firstRecord, secondRecord) =>
        firstRecord.revenue - secondRecord.revenue,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: (firstRecord, secondRecord) =>
        firstRecord.quantity - secondRecord.quantity,
    },
  ];

  return (
    <div className="templatemo-content-widget white-bg">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Dashboard</h2>
      </div>

      <div className="margin-bottom-30">
        <RangePicker
          format="DD-MM-YYYY"
          onChange={(dates) => {
            console.log("Date: ", dates);
            if (dates) {
              const startDate = dates[0].format("YYYY-MM-DD 00:00:00");
              console.log("startDate: ", startDate);

              const endDate = dates[1].format("YYYY-MM-DD 23:59:59");
              console.log("endDate: ", endDate);

              setDates({ startDate, endDate });
            }
          }}
        />
      </div>

      <Space direction="horizontal" className="margin-bottom-30">
        <DashboardCard
          icon={
            <DollarCircleOutlined
              style={{
                fontSize: 26,
                padding: 10,
                backgroundColor: "rgb(0, 255, 0, 0.25)",
                borderRadius: 50,
              }}
            />
          }
          title={"Revenue"}
          value={totalRevenue}
          suffix={"đ"}
        />
        <DashboardCard
          icon={
            <ShoppingOutlined
              style={{
                fontSize: 26,
                padding: 10,
                backgroundColor: "rgb(0, 255, 255, 0.25)",
                borderRadius: 50,
              }}
            />
          }
          title={"Order"}
          value={totalOrders}
        />
        <DashboardCard
          icon={
            <CoffeeOutlined
              style={{
                fontSize: 26,
                padding: 10,
                backgroundColor: "rgb(255, 255, 0, 0.25)",
                borderRadius: 50,
              }}
            />
          }
          title={"Drink"}
          value={totalDrink}
        />
      </Space>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h3>Revenue By Date</h3>

        <Button
          type="primary"
          onClick={() => handleExportToExcel(revenueByDate)}
        >
          Export <FileExcelOutlined />
        </Button>
      </div>

      <Table
        columns={columnsOfRevenueTable}
        dataSource={revenueByDate}
        pagination={{
          current: pageNumber,
          pageSize: pageSize,
          onChange: (pageNumber, pageSize) => {
            setPageNumber(pageNumber), setPageSize(pageSize);
          },
        }}
      ></Table>

      <LineChart
        chartTitle="Revenue By Date Line Chart"
        lineChartData={lineChartData}
      ></LineChart>

      <hr />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h3>Revenue By Drink</h3>

        <Button
          type="primary"
          onClick={() => handleExportToExcel(revenueByDrink)}
        >
          Export <FileExcelOutlined />
        </Button>
      </div>

      <Table
        columns={columnsOfDrinkTable}
        dataSource={revenueByDrink}
        pagination={{
          current: pageNumber,
          pageSize: pageSize,
          onChange: (pageNumber, pageSize) => {
            setPageNumber(pageNumber), setPageSize(pageSize);
          },
        }}
      ></Table>

      <BarChart
        chartTitle="Revenue By Drink Bar Chart"
        barChartData={barChartData}
      ></BarChart>
    </div>
  );
};

function DashboardCard({ title, value, icon, suffix }) {
  return (
    <Card>
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} suffix={suffix}></Statistic>
      </Space>
    </Card>
  );
}

export default ChartJS;
