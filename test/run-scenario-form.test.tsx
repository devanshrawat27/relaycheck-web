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

  it('never exposes a destination URL input', () => {
    const { container } = render(<RunScenarioForm />);

    expect(container.querySelector('input[type="url"]')).toBeNull();
    expect(container.querySelector('input[name="url"]')).toBeNull();
    expect(container.querySelector('input[name="destinationUrl"]')).toBeNull();
    // The only inputs are the three scenario radios.
    const inputs = Array.from(container.querySelectorAll('input'));
    expect(inputs).toHaveLength(3);
    expect(inputs.every((input) => input.getAttribute('name') === 'scenario')).toBe(true);
  });
});
