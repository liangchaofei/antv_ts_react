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
      year: '1951 年',
      sales: 38
    }, {
      year: '1952 年',
      sales: 52
    }, {
      year: '1956 年',
      sales: 61
    }, {
      year: '1957 年',
      sales: 145
    }, {
      year: '1958 年',
      sales: 48
    }, {
      year: '1959 年',
      sales: 38
    }, {
      year: '1960 年',
      sales: 38
    }, {
      year: '1962 年',
      sales: 38
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
      chart.scale('sales', {
        tickInterval: 20
      });
      chart.interval().position('year*sales');
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
