import React, { FunctionComponent, SVGAttributes } from 'react'
import styles from './styles.module.scss'
import { makePriceString } from 'src/helpers/strings'
import debounce from 'src/helpers/debounce'

interface IInput {
  id: string
  isLoading?: boolean
  label: string
  onChange?: (value: string) => void
  value?: string | number
  textarea?: number
  errorText?: string
  disabled?: boolean
  icon?: FunctionComponent<SVGAttributes<SVGElement>>
  onlyNumbers?: boolean
  withDots?: boolean
  className?: string
  delay?: number
  applyValue?: (value: string) => void
}

interface IState {
  inputValue: string | number
}

class Input extends React.PureComponent<IInput, IState> {
  constructor(props) {
    super(props)

    for (const prop in props) {
      this[prop] = prop
    }
  }

  state = {
    inputValue: '',
  }

  debouncedChange = debounce((value) => {
    const val = this.props.withDots ? value.replace(/\./g, '') : value
    this.props.onChange?.(val)
  }, this.props.delay)

  getNewValue = (value) => {
    const { withDots } = this.props

    if (withDots) {
      return makePriceString(value, 3)
    } else {
      return value
    }
  }

  componentDidMount() {
    const { value } = this.props

    if (value) {
      const newValue = this.getNewValue(value)

      this.setState({
        inputValue: newValue,
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const newValue = this.props.value

    if (prevProps.value !== newValue && newValue !== prevState.inputValue) {
      this.setState({ inputValue: newValue ? this.getNewValue(newValue) : '' })
    }
  }

  handleChange = (event) => {
    const value = event.target.value

    const newValue = this.getNewValue(value)

    this.setState({ inputValue: newValue })

    this.debouncedChange(newValue)
  }

  handleKeyDown = (event) => {
    const value = event.target.value
    const { onlyNumbers, applyValue } = this.props

    if (onlyNumbers) {
      const regExpForTest = /\d/

      if (event.key !== 'Backspace' && !regExpForTest.test(event.key)) {
        event.preventDefault()
      }
    }

    if (value && applyValue && [',', 'Enter'].includes(event.key)) {
      this.setState({ inputValue: '' })
      applyValue(value)
      event.preventDefault()
    }
  }

  renderInput() {
    const {
      id,
      textarea,
      disabled,
      className,
      label,
      errorText,
      withDots,
    } = this.props

    const { inputValue } = this.state

    const getInputType = () => {
      if (textarea) {
        return (
          <textarea
            id={id}
            className={styles.textarea}
            rows={textarea || 10}
            onChange={this.handleChange}
            value={inputValue || ''}
            disabled={disabled}
          />
        )
      }

      return (
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={this.handleChange}
          disabled={disabled}
          onKeyDown={this.handleKeyDown}
        />
      )
    }

    return (
      <div className={`${styles.input} ${className ? className : ''}`}>
        {getInputType()}
        <label
          htmlFor={id}
          className={`${styles.label} ${inputValue && styles.labelFloating}`}
        >
          {label}
        </label>
        {errorText && <p className={styles.errorText}>{errorText}</p>}
        {withDots && <span className={styles.currency}>kr.</span>}
      </div>
    )
  }

  render() {
    const { id, isLoading } = this.props

    return (
      <div data-name={id}>{isLoading ? 'Loading...' : this.renderInput()}</div>
    )
  }
}

export default Input
