$(function () {
  // Chart theme options
  const theme_options = {
    light: {
      theme: {
        mode: "light",
        palette: "palette1",
      },
    },
    dark: {
      theme: {
        mode: "dark",
        palette: "palette1",
      },
    },
  };

  axios
    .get("http://localhost:3009/api/v1/metrics/sensors-records")
    .then(function (response) {
      console.log(response);
      const chart1 = new ApexCharts(document.querySelector("#apexchart-1"), {
        ...theme_options.light,
        series: [
          {
            name: "Ground Tank Water Level",
            data: response.data.map((item) => item.sensor1 / 100),
          },
          {
            name: "Elevated Tank Water Level",
            data: response.data.map((item) => item.sensor2 / 100),
          },
        ],
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        title: {
          text: "Sensors Records",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: response.data.map((item) => item.plcTime),
        },
      });

      // Render all chart widgets
      chart1.render();

      // Theme toggle listener
      $("#switch-component-theme").on("change", function () {
        let isDark = $("body").hasClass("theme-dark");

        // Check wether dark theme enabled
        if (isDark) {
          chart1.updateOptions(theme_options.dark);
        } else {
          chart1.updateOptions(theme_options.light);
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
});
