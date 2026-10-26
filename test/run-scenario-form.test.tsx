import { render, screen } from '@testing-library/react';

jest.mock('@/lib/actions', () => ({
  createRunAction: jest.fn(),
}));

import { RunScenarioForm } from '@/components/run-scenario-form';

const TARGETS = [
  { name: 'demo-receiver', kind: 'demo' as const, oracle: true },
  { name: 'staging-webhook', kind: 'remote' as const, oracle: false },
];

describe('RunScenarioForm', () => {
  it('offers the supported scenarios as selectable cards and a preview', () => {
    render(<RunScenarioForm targets={TARGETS} />);

    const radios = screen.getAllByRole('radio');
    expect(radios.map((radio) => (radio as HTMLInputElement).value)).toEqual([
      'duplicate_delivery',
      'receiver_failure',
      'receiver_timeout',
    ]);
    expect((radios[0] as HTMLInputElement).checked).toBe(true);

    expect(screen.getByText('Choose a scenario')).toBeInTheDocument();
    expect(screen.getByText(/Bounded by design/)).toBeInTheDocument();
    expect(screen.getByText('Controlled receiver failure')).toBeInTheDocument();
    expect(screen.getByText('Receiver timeout')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start run/ })).toBeInTheDocument();
  });

  it('offers only configured targets and warns about remote targets', () => {
    render(<RunScenarioForm targets={TARGETS} />);

    const select = screen.getByLabelText('Target') as HTMLSelectElement;
    expect(Array.from(select.options).map((option) => option.value)).toEqual([
      'demo-receiver',
      'staging-webhook',
    ]);
    expect(screen.getByText(/no business-effect oracle/)).toBeInTheDocument();
  });

  it('exposes bounded advanced parameters', () => {
    render(<RunScenarioForm targets={TARGETS} />);

    expect(screen.getByLabelText(/Delivery attempts/)).toHaveAttribute('max', '5');
    expect(screen.getByLabelText(/Timeout per delivery/)).toHaveAttribute('max', '15000');
    expect(screen.getByLabelText(/Injected status/)).toHaveAttribute('min', '400');
    expect(screen.getByLabelText(/Injected delay/)).toHaveAttribute('max', '10000');
  });

  it('shows a review summary before submission', () => {
    render(<RunScenarioForm targets={TARGETS} />);

    expect(screen.getByText('Review what will run')).toBeInTheDocument();
    expect(screen.getAllByText('Duplicate delivery').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Scenario')).toBeInTheDocument();
  });

  it('never exposes a destination URL input', () => {
    const { container } = render(<RunScenarioForm targets={TARGETS} />);

    expect(container.querySelector('input[type="url"]')).toBeNull();
    expect(container.querySelector('input[name="url"]')).toBeNull();
    expect(container.querySelector('input[name="destinationUrl"]')).toBeNull();
    // Three scenario radios plus four bounded numeric overrides (target is a select).
    const inputs = Array.from(container.querySelectorAll('input'));
    expect(inputs).toHaveLength(7);
    const names = inputs.map((input) => input.getAttribute('name'));
    expect(names).toEqual([
      'scenario',
      'scenario',
      'scenario',
      'deliveryCount',
      'timeoutMs',
      'httpStatus',
      'delayMs',
    ]);
  });
});
