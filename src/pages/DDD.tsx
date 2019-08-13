import { Card, Divider } from 'antd';
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
        year: '1991',
        value: 15468
      }, {
        year: '1992',
        value: 16100
      }, {
        year: '1993',
        value: 15900
      }, {
        year: '1994',
        value: 17409
      }, {
        year: '1995',
        value: 17000
      }, {
        year: '1996',
        value: 31056
      }, {
        year: '1997',
        value: 31982
      }, {
        year: '1998',
        value: 32040
      }, {
        year: '1999',
        value: 33233
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

      chart.source(data);
    chart.scale({
      value: {
        min: 10000
      },
      year: {
        range: [0, 1]
      }
    });
    chart.axis('value', {
      label: {
        formatter: function formatter(val:any) {
          return (val / 10000).toFixed(1) + 'k';
        }
      }
    });
    chart.tooltip({
        crosshairs: {
          type: 'line'
        }
      });
      chart.area().position('year*value');
      chart.line().position('year*value').size(2);
      chart.render();
    }
  };
  render() {
    return (
      <Card
      >
        <div ref={this.chartContent} />
        <Divider />

        
      </Card>
    );
  }
}

export default UtilizationLine;
