import { Card } from 'antd';
import * as React from 'react';
import * as G2 from '@antv/g2';
interface UtilizationLineProps {
  height: number;
  type: string;
  id: number | string;
}
class UtilizationLine extends React.PureComponent<UtilizationLineProps> {
  chartContent = React.createRef<HTMLDivElement>();
  chart: any;
  state = {
    data: [{
      "month": "Jan",
      "city": "Tokyo",
      "temperature": 7
    }, {
      "month": "Jan",
      "city": "London",
      "temperature": 3.9
    }, {
      "month": "Feb",
      "city": "Tokyo",
      "temperature": 6.9
    }, {
      "month": "Feb",
      "city": "London",
      "temperature": 4.2
    }],
    width: 200,
    height: 200
  };
  componentDidMount() {
    this.generateChart();
  }
  generateChart = async () => {
    const { height = 300 } = this.props;
    const { data } = this.state;

    if (this.chart) {
      this.chart.changeData(data);
      this.chart.repaint();
    } else {
      const chart = (this.chart = new G2.Chart({
        container: this.chartContent.current!,
        forceFit: true,
        padding: [20, 55, 60, 60],
        height,
      }));

      chart.source(data, {
        month: {
          range: [0, 1]
        }
      });
      chart.tooltip({
        crosshairs: {
          type: 'line'
        }
      });
      chart.axis('temperature', {
        label: {
          formatter: function formatter(val) {
            return val + '°C';
          }
        }
      });
      chart.line().position('month*temperature').color('city');
      chart.point().position('month*temperature').color('city').size(4).shape('circle').style({
        stroke: '#fff',
        lineWidth: 1
      });
      chart.render();
    }
  };
  render() {
    return (
      <Card
      >
        <div ref={this.chartContent} />
      </Card>
    );
  }
}

export default UtilizationLine;
