import React, { Component } from 'react';
import { random } from '../utils';
import './Game.css';

export default class Game extends Component {
  state = {
    size: 6,
    task: [],
    numbers: [],
    rows: [],
    cols: [],
    active: [],
  };

  setup() {
    const { size } = this.state;

    const newTask = new Array(size)
      .fill(0)
      .map(_ =>
        new Array(size).fill(0).map(_ => (random(0, 1) ? random() : 0))
      );

    const newRows = new Array(size)
      .fill(0)
      .map((r, i) => newTask[i].reduce((sum, n) => sum + n));

    const newCols = new Array(size).fill(0).map((c, i) => {
      let sum = 0;
      newTask.forEach(row => (sum += row[i]));
      return sum;
    });

    return { newTask, newRows, newCols };
  }

  componentDidMount() {
    const { size } = this.state;

    let task = [0];
    let rows = [0];
    let cols = [0];

    while (rows.some(n => n === 0) || cols.some(n => n === 0)) {
      const { newTask, newRows, newCols } = this.setup();

      task = newTask;
      rows = newRows;
      cols = newCols;
      console.log(task, rows, cols);
    }

    const numbers = task.map(row => row.map(n => (n > 0 ? n : random())));

    // TODO: make in 1d for better change
    const active = new Array(size + 1)
      .fill(new Array(size + 1).fill(0))
      .map(row => row.map(cell => false));

    this.setState({ task, numbers, rows, cols, active });
  }

  render() {
    const { numbers, rows, cols, active } = this.state;

    const complete = [
      ['', ...cols],
      ...numbers.map((row, i) => [rows[i], ...row]),
    ];

    // TODO: get rid of table, make cells comps and give then onClick toggleActive
    // TODO: check sums of rows, cols and compare to state
    return (
      <table>
        <tbody>
          {complete.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                i === 0 || j === 0 ? (
                  <th key={j}>{cell}</th>
                ) : (
                  <td key={j} className={active[i][j] ? 'active' : ''}>
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
