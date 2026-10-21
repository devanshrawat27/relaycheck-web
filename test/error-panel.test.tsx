import { render, screen } from '@testing-library/react';
import { ErrorPanel } from '@/components/error-panel';

describe('ErrorPanel', () => {
  it('renders an accessible alert with title, message, and hint', () => {
    render(
      <ErrorPanel
        title="Could not reach the Control API"
        message="Control API responded with HTTP 500"
        hint="Start the Control API and reload."
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Could not reach the Control API')).toBeInTheDocument();
    expect(screen.getByText('Control API responded with HTTP 500')).toBeInTheDocument();
    expect(screen.getByText('Start the Control API and reload.')).toBeInTheDocument();
  });

  it('works without a hint', () => {
    render(<ErrorPanel title="Error" message="Something failed" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Something failed');
  });
});
