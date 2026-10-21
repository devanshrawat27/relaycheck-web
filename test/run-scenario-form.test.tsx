import { render, screen } from '@testing-library/react';

jest.mock('@/lib/actions', () => ({
  createRunAction: jest.fn(),
}));

import { RunScenarioForm } from '@/components/run-scenario-form';

describe('RunScenarioForm', () => {
  it('offers the supported scenarios and a preview', () => {
    render(<RunScenarioForm />);

    const select = screen.getByLabelText('Scenario') as HTMLSelectElement;
    expect(Array.from(select.options).map((option) => option.value)).toEqual([
      'duplicate_delivery',
      'receiver_failure',
      'receiver_timeout',
    ]);

    expect(screen.getByText('Planned behavior')).toBeInTheDocument();
    expect(screen.getAllByText(/Controlled receiver failure/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Receiver timeout/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('button', { name: 'Start run' })).toBeInTheDocument();
  });

  it('never exposes a destination URL input', () => {
    const { container } = render(<RunScenarioForm />);

    expect(container.querySelector('input[type="url"]')).toBeNull();
    expect(container.querySelector('input[name="url"]')).toBeNull();
    expect(container.querySelector('input[name="destinationUrl"]')).toBeNull();
    // The only form control is the scenario selector.
    expect(container.querySelectorAll('input, select').length).toBe(1);
  });
});
