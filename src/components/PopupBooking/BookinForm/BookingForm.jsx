/* eslint-disable no-useless-escape */
import React, {useState} from 'react'
import axios from 'axios'
import classes from './BookingForm.module.sass'

import Input from '../../UI/Input/Input'
import Checkbox from '../../UI/Checkbox/Checkbox'
import Button from '../../UI/Button/Button'
import CloseForm from '../../UI/CloseForm/CloseForm'
import Loader from '../../UI/Loader/Loader'
import DatePickerElement from '../../UI/DatePicker/DatePicker'

function validation(type, value, shouldValidate) {
  if (!shouldValidate) {
    return true
  }
  switch (type) {
    case 'text':
      if (value.trim() === '') {
        return false
      }
      return true
    case 'tel':
      const tel = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/
      return tel.test(value)
    case 'email':
      const email =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return email.test(String(value).toLowerCase())
    default:
      return true
  }
}

function formValid(state) {
  let valid = true
  Object.keys(state).map(inputName => (valid = state[inputName].valid && valid))
  return valid
}

const BookingForm = ({close}) => {
  //текстовые поля
  const [textInput, setTextInput] = useState({
    inputs: {
      FIO: {
        type: 'text',
        label: 'Введите ФИО',
        value: '',
        errorMessage: 'ФИО не может быть пустая строка',
        valid: false,
        shouldValidate: true,
        touched: false,
        focuse: false,
      },
      TEL: {
        type: 'tel',
        label: 'Введите номер телефона',
        value: '',
        errorMessage: 'Неверно введён номер телефона',
        valid: false,
        shouldValidate: true,
        touched: false,
        focuse: false,
      },
    },
    checkbox: {
      label: [
        'люкс Пурпурный',
        'люкс Безжевый',
        'улучшенный Солнечный',
        'стандарт Уютный',
        'стандарт Семейный',
      ],
      value: ['1-улучшенный', '3-люкс', '4-люкс', '5-стандарт', '6-стандарт'],
      errorMessage: 'Неверно введён номер телефона',
      checkedRooms: [],
    },
    datePicker: {start: new Date(), end: new Date()},
    spanName: ['Заезд', 'Выезд'],
    datePickerValid: false,
    datePickerTouched: false,
    formValid: false,
  })
  //ответ на отправку заявки
  const [bookingAnswer, setBookingAnswer] = useState({
    loader: false,
    answer:
      'Спасибо за заявку. С вами свяжется администратор, для подтверждения бронирования',
    answerTable: false,
  })

  const formHandler = e => {
    e.preventDefault()
  }

  const onChangeHandlerText = (event, inputName, state, setState) => {
    const inputsState = {...state.inputs}
    const inputState = {...inputsState[inputName]}

    inputState.value = event.target.value
    inputState.touched = true

    inputState.valid = validation(
      inputState.type,
      event.target.value,
      inputState.shouldValidate
    )
    inputsState[inputName] = inputState
    const isFormValid = formValid(inputsState)

    setState({...state, inputs: inputsState, formValid: isFormValid})
  }

  const onChangeHandlerCheckbox = (event, state, setState) => {
    const localState = {...state.checkbox}

    if (event.currentTarget.checked) {
      localState.checkedRooms.push(event.target.value)
    } else {
      localState.checkedRooms = localState.checkedRooms.filter(
        item => item !== event.target.value
      )
    }

    setState({...state, checkbox: localState})
  }

  const onFormSubmit = async () => {
    setBookingAnswer({...bookingAnswer, loader: true})

    const information = {
      fio: textInput.inputs.FIO.value.trim(),
      tel: textInput.inputs.TEL.value.trim(),
      rooms: textInput.checkbox.checkedRooms.join(', '),
      date: '',
    }

    const startDate = new Date(textInput.datePicker.start)
    const endDate = new Date(textInput.datePicker.end)

    information.date = `с ${startDate.getDate()}/${
      startDate.getMonth() + 1
    }/${startDate.getFullYear()} до ${endDate.getDate()}/${
      endDate.getMonth() + 1
    }/${endDate.getFullYear()}`

    try {
      await axios.post('/api/booking', information)
      setBookingAnswer({...bookingAnswer, answerTable: true, loader: false})
    } catch (error) {
      setBookingAnswer({
        answerTable: true,
        answer: 'Что-то пошло не так...',
        loader: false,
      })
    }
  }

  const onFocusChangeLabel = (inputName, state, setState) => {
    const inputsState = {...state.inputs}
    const inputState = {...inputsState[inputName]}

    inputState.focuse = true
    inputsState[inputName] = inputState
    setState({...state, inputs: inputsState})
  }

  const onBlurChangeLabel = (inputName, state, setState) => {
    const inputsState = {...state.inputs}
    const inputState = {...inputsState[inputName]}

    inputState.focuse = false
    inputsState[inputName] = inputState
    setState({...state, inputs: inputsState})
  }

  const onChangeDatepiker = (date, datePicerOption) => {
    const localState = {...textInput.datePicker}

    localState[datePicerOption] = date

    const startMs = Date.parse(localState.start.toString())
    const endMs = Date.parse(localState.end.toString())
    let valid = false
    let touched = false
    if (datePicerOption === 'end') {
      touched = true
      if (endMs >= startMs) {
        valid = true
      }
    }

    setTextInput({
      ...textInput,
      datePicker: localState,
      datePickerTouched: touched,
      datePickerValid: valid,
    })
  }

  return (
    <>
      {bookingAnswer.loader ? (
        <Loader />
      ) : (
        <div className={classes.BookingForm}>
          {bookingAnswer.answerTable ? (
            <div className={classes.answer}>{bookingAnswer.answer}</div>
          ) : (
            <form onSubmit={formHandler}>
              {Object.keys(textInput.inputs).map((inputName, index) => (
                <Input
                  key={index + 'z'}
                  {...textInput.inputs[inputName]}
                  onChange={event =>
                    onChangeHandlerText(
                      event,
                      inputName,
                      textInput,
                      setTextInput
                    )
                  }
                  onFocusChangeLabel={() =>
                    onFocusChangeLabel(inputName, textInput, setTextInput)
                  }
                  onBlurChangeLabel={() =>
                    onBlurChangeLabel(inputName, textInput, setTextInput)
                  }
                />
              ))}

              <div className={classes.checkbox}>
                <div className={classes.checkboxSpan}>
                  Выберите номера для броинрования:
                </div>
                {textInput.checkbox.value.map((item, index) => (
                  <Checkbox
                    key={index + 'q'}
                    value={item}
                    label={textInput.checkbox.label[index]}
                    onChange={event =>
                      onChangeHandlerCheckbox(event, textInput, setTextInput)
                    }
                  />
                ))}
              </div>

              <div className={classes.datePicker}>
                {Object.keys(textInput.datePicker).map(
                  (datePicerOption, index) => (
                    <React.Fragment key={index + 'x'}>
                      <span>{textInput.spanName[index]}:</span>
                      <DatePickerElement
                        local={
                          localStorage.getItem('i18nextLng').toLowerCase() ||
                          'en'
                        }
                        dateFormat="dd/MM/yyyy"
                        selected={textInput.datePicker[datePicerOption]}
                        onChange={date =>
                          onChangeDatepiker(date, datePicerOption)
                        }
                      />
                    </React.Fragment>
                  )
                )}
              </div>
              {!textInput.datePickerValid && textInput.datePickerTouched && (
                <p style={{color: 'red', marginBottom: '1rem'}}>
                  Неверная дата
                </p>
              )}

              <div className={classes.button}>
                <Button
                  type="primary"
                  disabled={!textInput.formValid}
                  onClick={onFormSubmit}
                >
                  Отправить заявку
                </Button>
              </div>
            </form>
          )}
          <CloseForm onClick={close} />
        </div>
      )}
    </>
  )
}

export default BookingForm
