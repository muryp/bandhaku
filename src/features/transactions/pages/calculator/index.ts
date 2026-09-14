import { $id } from '@/utils/id'
import { addScript } from '@/utils/addScript'
import { Button } from '@/shared/components/Btn'
import { FormWrapper } from '@/shared/components/Card/FormWrapper'

type TCurrency = 'IDR' | 'USD' | 'EUR' | 'JPY'

type MoneyCalculatorProps = {
  currency?: TCurrency
  locale?: string
  onChange?: (value: number, element: HTMLElement, event: Event) => void
}

export const MoneyCalculator = ({
  currency = 'IDR',
  locale = 'id-ID',
  onChange,
}: MoneyCalculatorProps = {}) => {
  const [idTag, action] = $id()

  let currentVal = '0'
  let previousVal = ''
  let operator: '+' | '-' | '*' | '/' | null = null
  let shouldReset = false

  const formatCurrency = (val: string | number) => {
    const amount = typeof val === 'string' ? parseFloat(val) || 0 : val
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: currency === 'IDR' ? 0 : 2,
    }).format(amount)
  }

  const updateUI = (root: HTMLElement) => {
    const mainDisplay = root.querySelector('.main-display') as HTMLElement
    const historyDisplay = root.querySelector('.history-display') as HTMLElement
    const opButtons = root.querySelectorAll(
      '.btn-operator',
    ) as NodeListOf<HTMLElement>

    mainDisplay.textContent = formatCurrency(currentVal)
    historyDisplay.textContent = previousVal
      ? `${formatCurrency(previousVal)} ${operator || ''}`
      : ''

    opButtons.forEach((btn) => {
      const opValue = btn.getAttribute('data-op')
      if (operator !== null && opValue === operator) {
        btn.classList.add('ring-2', 'ring-primary', 'bg-primary/20')
      } else {
        btn.classList.remove('ring-2', 'ring-primary', 'bg-primary/20')
      }
    })
  }

  const calculate = () => {
    const prev = parseFloat(previousVal)
    const curr = parseFloat(currentVal)
    if (isNaN(prev)) return curr
    switch (operator) {
    case '+':
      return prev + curr
    case '-':
      return prev - curr
    case '*':
      return prev * curr
    case '/':
      return curr !== 0 ? prev / curr : 0
    default:
      return curr
    }
  }

  const handleInput = (val: string, root: HTMLElement, e: Event) => {
    const isOperator = ['+', '-', '*', '/'].includes(val)

    if (isOperator) {
      if (shouldReset && operator !== null) {
        operator = val as any
      } else {
        if (previousVal !== '' && !shouldReset)
          currentVal = calculate().toString()
        previousVal = currentVal
        operator = val as any
        shouldReset = true
      }
    } else if (val === '=' || val === 'Enter') {
      if (operator && previousVal !== '') {
        currentVal = calculate().toString()
        previousVal = ''
        operator = null
        shouldReset = true
      }
    } else if (val === 'C' || val === 'Escape') {
      currentVal = '0'
      previousVal = ''
      operator = null
      shouldReset = false
    } else if (val === 'DEL' || val === 'Backspace') {
      currentVal = currentVal.length > 1 ? currentVal.slice(0, -1) : '0'
    } else if (/^\d$/.test(val) || val === '00' || val === '000') {
      if (shouldReset) {
        currentVal = val
        shouldReset = false
      } else {
        currentVal = currentVal === '0' ? val : currentVal + val
      }
    }

    updateUI(root)
    if (onChange) onChange(parseFloat(currentVal) || 0, root, e)
  }

  const Key = (
    label: string,
    value: string,
    color: any = 'neutral',
    className = '',
  ) => {
    const isOp = ['+', '-', '*', '/'].includes(value)
    return Button({
      label,
      variant: 'ghost',
      color,
      className: `h-14 text-lg font-bold transition-all ${isOp ? 'btn-operator' : ''} ${className}`,
      onClick: (btnEl, e) => {
        action((root) => {
          if (isOp) btnEl.setAttribute('data-op', value)
          handleInput(value, root, e)
        })
      },
    })
  }

  const CalcContent = html`
    <div
      ${idTag}
      tabindex="0"
      class="flex flex-col gap-4 p-2 outline-none group">
      <div
        class="bg-base-200/50 p-5 rounded-2xl text-right border-2 border-transparent transition-all
                  group-focus:border-primary group-focus:bg-base-200 group-focus:ring-4 group-focus:ring-primary/10
                  min-h-[110px] flex flex-col justify-end cursor-pointer relative">
        <span
          class="absolute left-4 top-4 text-[10px] font-bold opacity-0 group-focus:opacity-100 text-primary uppercase transition-opacity">
          ● Keyboard Active
        </span>
        <div
          class="history-display text-xs font-bold text-base-content/30 h-5 truncate tracking-wide"></div>
        <div
          class="main-display text-3xl font-black text-primary truncate mt-1">
          ${formatCurrency('0')}
        </div>
      </div>

      <div class="grid grid-cols-4 gap-2">
        ${Key('C', 'C', 'error')} ${Key('÷', '/', 'accent')}
        ${Key('×', '*', 'accent')} ${Key('⌫', 'DEL', 'neutral')}
        ${Key('7', '7')} ${Key('8', '8')} ${Key('9', '9')}
        ${Key('-', '-', 'accent')} ${Key('4', '4')} ${Key('5', '5')}
        ${Key('6', '6')} ${Key('+', '+', 'accent')} ${Key('1', '1')}
        ${Key('2', '2')} ${Key('3', '3')}
        ${Key('=', '=', 'primary', 'row-span-2 !h-full')} ${Key('0', '0')}
        ${Key('00', '00')} ${Key('000', '000')}
      </div>
    </div>
  `

  addScript((el) => {
    action((root) => {
      updateUI(root)

      // Registrasi Keyboard Listener
      root.addEventListener('keydown', (e: KeyboardEvent) => {
        // Mencegah scroll saat tekan spasi atau panah
        if ([' ', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault()

        let key = e.key
        if (key === '*') key = '*'
        if (key === '/') key = '/'

        // Handle physical keyboard mapping
        handleInput(key, root, e)
      })
    })
  })

  return FormWrapper({
    title: 'Keyboard Calculator',
    description: 'Click the display to enable typing',
    content: CalcContent,
    className: 'max-w-xs mx-auto shadow-xl',
    onSubmit: (e) => e.preventDefault(),
  })
}
