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
    sumRows: [],
    sumCols: [],
    active: [],
    finished: false,
  };

  setup() {
    const { size } = this.state;

    const newTask = new Array(size)
      .fill(0)
      .map(_ =>
        new Array(size).fill(0).map(_ => (random(1, 10) > 3 ? random() : 0))
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

  getSums = () => {
    const { active, numbers, size, rows, cols } = this.state;

    // sum up rows
    const sumRows = numbers.map((row, ri) =>
      row.reduce((s, n, ci) => (active[ri * size + ci] ? s + n : s), 0)
    );

    const sumCols = new Array(size).fill(0);

    numbers.forEach((row, ri) =>
      row.forEach((cell, ci) => {
        if (active[ri * size + ci]) {
          sumCols[ci] = sumCols[ci] + cell;
        }
      })
    );

    let finished = false;
    if (rows === sumRows && cols === sumCols) finished = true;

    this.setState({ sumRows, sumCols, finished });
  };

  toggleActive = index => {
    const { active } = this.state;

    const newActive = [...active];
    newActive[index] = !active[index];

    this.setState({ active: newActive }, this.getSums);
  };

  componentDidMount() {
    const { size } = this.state;

    let task = [];
    let rows = [0];
    let cols = [0];

    while (rows.some(n => n === 0) || cols.some(n => n === 0)) {
      const { newTask, newRows, newCols } = this.setup();

      task = newTask;
      rows = newRows;
      cols = newCols;
    }

    const numbers = task.map(row => row.map(n => (n > 0 ? n : random())));

    const active = new Array(size ** 2).fill(0).map(cell => false);

    this.setState({ task, numbers, rows, cols, active });
  }

  render() {
    const { numbers, rows, cols, active, size, sumCols, sumRows } = this.state;

    const complete = [
      ['', ...cols],
      ...numbers.map((row, i) => [rows[i], ...row]),
    ];

    // TODO: get rid of table
    // TODO: make cells comps
    return (
      <table>
        <tbody>
          {complete.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) =>
                (ri === 0 && ci > 0) || (ci === 0 && ri > 0) ? (
                  <th
                    key={ci}
                    className={
                      (ri === 0 && cols[ci - 1] === sumCols[ci - 1]) ||
                      (ci === 0 && rows[ri - 1] === sumRows[ri - 1])
                        ? 'finished'
                        : ''
                    }
                  >
                    {cell}
                  </th>
                ) : (
                  <td
                    key={ci}
                    className={
                      active[(ri - 1) * size + (ci - 1)] ? 'active' : ''
                    }
                    onClick={() => {
                      const index = (ri - 1) * size + (ci - 1);
                      this.toggleActive(index);
                    }}
                  >
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
