import { render, screen } from '@testing-library/react';

jest.mock('@/lib/actions', () => ({
  createRunAction: jest.fn(),
}));

import { RunScenarioForm } from '@/components/run-scenario-form';

describe('RunScenarioForm', () => {
  it('offers the supported scenarios as selectable cards and a preview', () => {
    render(<RunScenarioForm />);

    const radios = screen.getAllByRole('radio');
    expect(radios.map((radio) => (radio as HTMLInputElement).value)).toEqual([
      'duplicate_delivery',
      'receiver_failure',
      'receiver_timeout',
    ]);
    expect((radios[0] as HTMLInputElement).checked).toBe(true);

    expect(screen.getByText('Choose a scenario')).toBeInTheDocument();
    expect(screen.getByText('Bounded by design')).toBeInTheDocument();
    expect(screen.getByText('Controlled receiver failure')).toBeInTheDocument();
    expect(screen.getByText('Receiver timeout')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start run/ })).toBeInTheDocument();
  });

  it('exposes bounded advanced parameters', () => {
    render(<RunScenarioForm />);

    expect(screen.getByLabelText(/Delivery attempts/)).toHaveAttribute('max', '5');
    expect(screen.getByLabelText(/Timeout per delivery/)).toHaveAttribute('max', '15000');
    expect(screen.getByLabelText(/Injected status/)).toHaveAttribute('min', '400');
    expect(screen.getByLabelText(/Injected delay/)).toHaveAttribute('max', '10000');
  });

  it('never exposes a destination URL input', () => {
    const { container } = render(<RunScenarioForm />);

    expect(container.querySelector('input[type="url"]')).toBeNull();
    expect(container.querySelector('input[name="url"]')).toBeNull();
    expect(container.querySelector('input[name="destinationUrl"]')).toBeNull();
    // Three scenario radios plus four bounded numeric overrides.
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
